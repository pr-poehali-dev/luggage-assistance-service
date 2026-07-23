import json
import os
import base64
import io


def handler(event: dict, context) -> dict:
    """Управление клиентами партнёра: список, создание, назначение лояльности, загрузка Excel."""

    cors = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    }

    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': cors, 'body': ''}

    import psycopg2
    import psycopg2.extras

    method = event.get('httpMethod', 'GET')
    params = event.get('queryStringParameters') or {}
    partner_id = params.get('partner_id')

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

    # ── GET: уровни лояльности партнёра ──
    if method == 'GET' and params.get('resource') == 'levels':
        if not partner_id:
            cur.close(); conn.close()
            return {'statusCode': 400, 'headers': cors, 'body': json.dumps({'error': 'partner_id обязателен'})}
        cur.execute("SELECT * FROM loyalty_levels WHERE partner_id = %s ORDER BY id", (partner_id,))
        levels = [dict(r) for r in cur.fetchall()]
        cur.close()
        conn.close()
        return {'statusCode': 200, 'headers': cors, 'body': json.dumps({'levels': levels}, ensure_ascii=False, default=str)}

    # ── GET: список клиентов партнёра ──
    if method == 'GET':
        if not partner_id:
            cur.close(); conn.close()
            return {'statusCode': 400, 'headers': cors, 'body': json.dumps({'error': 'partner_id обязателен'})}

        search = (params.get('search') or '').strip()

        query = """
            SELECT
                c.id, c.full_name, c.surname, c.email, c.phone, c.client_code,
                cl.balance_money, cl.balance_services,
                ll.id as loyalty_level_id, ll.name as loyalty_level_name, ll.limit_type
            FROM clients c
            JOIN client_loyalty cl ON cl.client_id = c.id
            LEFT JOIN loyalty_levels ll ON ll.id = cl.loyalty_level_id
            WHERE cl.partner_id = %s
        """
        args = [partner_id]

        if search:
            query += " AND (c.full_name ILIKE %s OR c.phone ILIKE %s OR c.email ILIKE %s)"
            like = f"%{search}%"
            args += [like, like, like]

        query += " ORDER BY c.created_at DESC LIMIT 200"

        cur.execute(query, tuple(args))
        rows = [dict(r) for r in cur.fetchall()]
        cur.close()
        conn.close()
        return {'statusCode': 200, 'headers': cors, 'body': json.dumps({'clients': rows}, ensure_ascii=False, default=str)}

    # ── POST: создание/обновление клиента, назначение лояльности, загрузка Excel ──
    body = json.loads(event.get('body') or '{}')
    action = body.get('action', 'create_client')

    if action == 'create_client':
        partner_id = body.get('partner_id')
        full_name = (body.get('full_name') or '').strip()
        surname = (body.get('surname') or '').strip()
        phone = (body.get('phone') or '').strip()
        email = (body.get('email') or '').strip().lower()
        loyalty_level_id = body.get('loyalty_level_id')

        if not partner_id or not full_name or not phone:
            cur.close(); conn.close()
            return {'statusCode': 400, 'headers': cors, 'body': json.dumps({'error': 'ФИО, телефон и партнёр обязательны'})}

        # Идентификация по телефону: ищем существующего клиента
        cur.execute("SELECT * FROM clients WHERE phone = %s", (phone,))
        existing = cur.fetchone()

        if existing:
            client_id = existing['id']
            cur.execute(
                "UPDATE clients SET full_name = %s, surname = %s, email = COALESCE(NULLIF(%s, ''), email) WHERE id = %s",
                (full_name, surname, email, client_id)
            )
        else:
            fallback_email = email or f"{phone.replace('+', '').replace(' ', '')}@noemail.local"
            cur.execute(
                "INSERT INTO clients (full_name, surname, email, phone) VALUES (%s, %s, %s, %s) RETURNING id",
                (full_name, surname, fallback_email, phone)
            )
            client_id = cur.fetchone()['id']

        # Назначаем/обновляем лояльность у партнёра
        limit_month = None
        limit_year = None
        if loyalty_level_id:
            cur.execute("SELECT * FROM loyalty_levels WHERE id = %s", (loyalty_level_id,))
            level = cur.fetchone()
            if level:
                limit_month = level['limit_month']
                limit_year = level['limit_year']

        cur.execute(
            """
            INSERT INTO client_loyalty (client_id, partner_id, loyalty_level_id, balance_money, balance_services)
            VALUES (%s, %s, %s, %s, %s)
            ON CONFLICT (client_id, partner_id) DO UPDATE SET
                loyalty_level_id = EXCLUDED.loyalty_level_id,
                balance_money = COALESCE(client_loyalty.balance_money, EXCLUDED.balance_money),
                balance_services = COALESCE(client_loyalty.balance_services, EXCLUDED.balance_services)
            """,
            (client_id, partner_id, loyalty_level_id, limit_month, None)
        )
        conn.commit()
        cur.close()
        conn.close()
        return {'statusCode': 200, 'headers': cors, 'body': json.dumps({'success': True, 'client_id': client_id})}

    if action == 'create_level':
        partner_id = body.get('partner_id')
        name = (body.get('name') or '').strip()
        limit_type = body.get('limit_type', 'money')
        limit_month = body.get('limit_month')
        limit_year = body.get('limit_year')
        is_unlimited = bool(body.get('is_unlimited', False))

        if not partner_id or not name:
            cur.close(); conn.close()
            return {'statusCode': 400, 'headers': cors, 'body': json.dumps({'error': 'partner_id и название уровня обязательны'})}

        cur.execute(
            """
            INSERT INTO loyalty_levels (partner_id, name, limit_type, limit_month, limit_year, is_unlimited)
            VALUES (%s, %s, %s, %s, %s, %s)
            RETURNING id
            """,
            (partner_id, name, limit_type, limit_month, limit_year, is_unlimited)
        )
        level_id = cur.fetchone()['id']
        conn.commit()
        cur.close()
        conn.close()
        return {'statusCode': 200, 'headers': cors, 'body': json.dumps({'success': True, 'level_id': level_id})}

    if action == 'update_loyalty':
        client_id = body.get('client_id')
        partner_id = body.get('partner_id')
        loyalty_level_id = body.get('loyalty_level_id')

        if not client_id or not partner_id:
            cur.close(); conn.close()
            return {'statusCode': 400, 'headers': cors, 'body': json.dumps({'error': 'client_id и partner_id обязательны'})}

        cur.execute(
            "UPDATE client_loyalty SET loyalty_level_id = %s WHERE client_id = %s AND partner_id = %s",
            (loyalty_level_id, client_id, partner_id)
        )
        conn.commit()
        cur.close()
        conn.close()
        return {'statusCode': 200, 'headers': cors, 'body': json.dumps({'success': True})}

    if action == 'upload_excel':
        # Ожидаем base64 XLSX с колонками: Фамилия, Имя, Телефон, Уровень лояльности
        partner_id = body.get('partner_id')
        file_b64 = body.get('file_base64')

        if not partner_id or not file_b64:
            cur.close(); conn.close()
            return {'statusCode': 400, 'headers': cors, 'body': json.dumps({'error': 'partner_id и файл обязательны'})}

        import openpyxl

        file_bytes = base64.b64decode(file_b64)
        wb = openpyxl.load_workbook(io.BytesIO(file_bytes), data_only=True)
        ws = wb.active

        # Собираем уровни лояльности партнёра для сопоставления по имени
        cur.execute("SELECT id, name FROM loyalty_levels WHERE partner_id = %s", (partner_id,))
        levels_by_name = {r['name'].strip().lower(): r['id'] for r in cur.fetchall()}

        created = 0
        updated = 0
        errors = []

        rows = list(ws.iter_rows(min_row=2, values_only=True))
        for idx, row in enumerate(rows, start=2):
            if not row or all(v is None for v in row):
                continue
            surname = str(row[0]).strip() if len(row) > 0 and row[0] else ''
            first_name = str(row[1]).strip() if len(row) > 1 and row[1] else ''
            phone = str(row[2]).strip() if len(row) > 2 and row[2] else ''
            level_name = str(row[3]).strip().lower() if len(row) > 3 and row[3] else ''

            if not phone:
                errors.append(f"Строка {idx}: не указан телефон")
                continue

            full_name = first_name or surname
            loyalty_level_id = levels_by_name.get(level_name)

            cur.execute("SELECT id FROM clients WHERE phone = %s", (phone,))
            existing = cur.fetchone()

            if existing:
                client_id = existing['id']
                cur.execute(
                    "UPDATE clients SET full_name = %s, surname = %s WHERE id = %s",
                    (full_name, surname, client_id)
                )
                updated += 1
            else:
                fallback_email = f"{phone.replace('+', '').replace(' ', '')}@noemail.local"
                cur.execute(
                    "INSERT INTO clients (full_name, surname, email, phone) VALUES (%s, %s, %s, %s) RETURNING id",
                    (full_name, surname, fallback_email, phone)
                )
                client_id = cur.fetchone()['id']
                created += 1

            limit_month = None
            if loyalty_level_id:
                cur.execute("SELECT limit_month FROM loyalty_levels WHERE id = %s", (loyalty_level_id,))
                lv = cur.fetchone()
                if lv:
                    limit_month = lv['limit_month']

            cur.execute(
                """
                INSERT INTO client_loyalty (client_id, partner_id, loyalty_level_id, balance_money)
                VALUES (%s, %s, %s, %s)
                ON CONFLICT (client_id, partner_id) DO UPDATE SET
                    loyalty_level_id = EXCLUDED.loyalty_level_id
                """,
                (client_id, partner_id, loyalty_level_id, limit_month)
            )

        conn.commit()
        cur.close()
        conn.close()
        return {
            'statusCode': 200,
            'headers': cors,
            'body': json.dumps({'success': True, 'created': created, 'updated': updated, 'errors': errors}, ensure_ascii=False)
        }

    cur.close()
    conn.close()
    return {'statusCode': 400, 'headers': cors, 'body': json.dumps({'error': 'Неизвестное действие'})}