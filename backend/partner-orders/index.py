import json
import os
from datetime import datetime, timedelta


def handler(event: dict, context) -> dict:
    """Заказы партнёра: создание заказа за клиента, список с поиском и фильтрами."""

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

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

    # ── GET: агрегированная статистика (вкладка "История") ──
    if method == 'GET' and params.get('resource') == 'stats':
        partner_id = params.get('partner_id')
        if not partner_id:
            cur.close(); conn.close()
            return {'statusCode': 400, 'headers': cors, 'body': json.dumps({'error': 'partner_id обязателен'})}

        period = params.get('period', 'month')
        location = (params.get('location') or '').strip()
        direction = (params.get('direction') or '').strip()

        now = datetime.utcnow()
        since = now - timedelta(days=30)
        until = None

        if period == 'today':
            since = now.replace(hour=0, minute=0, second=0, microsecond=0)
        elif period == 'yesterday':
            since = (now - timedelta(days=1)).replace(hour=0, minute=0, second=0, microsecond=0)
            until = now.replace(hour=0, minute=0, second=0, microsecond=0)
        elif period == 'week':
            since = now - timedelta(days=7)
        elif period == 'month':
            since = now - timedelta(days=30)
        elif period == 'prev_month':
            since = now - timedelta(days=60)
            until = now - timedelta(days=30)
        elif period == 'year':
            since = now - timedelta(days=365)

        query = """
            SELECT service_kind, status, station, service_type, COUNT(*) as cnt
            FROM baggage_orders
            WHERE partner_id = %s AND created_at >= %s
        """
        args = [partner_id, since]

        if until:
            query += " AND created_at < %s"
            args.append(until)
        if location:
            query += " AND station ILIKE %s"
            args.append(f"%{location}%")
        if direction:
            query += " AND service_type = %s"
            args.append(direction)

        query += " GROUP BY service_kind, status, station, service_type"

        cur.execute(query, tuple(args))
        rows = [dict(r) for r in cur.fetchall()]
        cur.close()
        conn.close()

        total_by_kind = {}
        total_done = 0
        total_all = 0
        for r in rows:
            kind = r['service_kind'] or 'meet'
            total_by_kind[kind] = total_by_kind.get(kind, 0) + r['cnt']
            total_all += r['cnt']
            if r['status'] == 'done':
                total_done += r['cnt']

        return {
            'statusCode': 200,
            'headers': cors,
            'body': json.dumps({
                'period': period,
                'total_orders': total_all,
                'total_done': total_done,
                'by_service_kind': total_by_kind,
                'details': rows
            }, ensure_ascii=False, default=str)
        }

    # ── GET: список заказов партнёра с поиском/фильтрами ──
    if method == 'GET':
        partner_id = params.get('partner_id')
        if not partner_id:
            cur.close(); conn.close()
            return {'statusCode': 400, 'headers': cors, 'body': json.dumps({'error': 'partner_id обязателен'})}

        search = (params.get('search') or '').strip()
        status = (params.get('status') or '').strip()
        service_kind = (params.get('service_kind') or '').strip()
        period = (params.get('period') or '').strip()

        query = """
            SELECT id, full_name, phone, email, station, destination, pickup_address,
                   bags_count, arrival_time, status, payment_status, payment_amount,
                   service_type, service_kind, payer, train_number, notes, created_at
            FROM baggage_orders
            WHERE partner_id = %s
        """
        args = [partner_id]

        if search:
            query += " AND (full_name ILIKE %s OR station ILIKE %s OR id::text = %s)"
            like = f"%{search}%"
            args += [like, like, search]

        if status:
            query += " AND status = %s"
            args.append(status)

        if service_kind:
            query += " AND service_kind = %s"
            args.append(service_kind)

        if period:
            now = datetime.utcnow()
            since = None
            if period == 'today':
                since = now.replace(hour=0, minute=0, second=0, microsecond=0)
            elif period == 'week':
                since = now - timedelta(days=7)
            elif period == 'month':
                since = now - timedelta(days=30)
            if since:
                query += " AND created_at >= %s"
                args.append(since)

        query += " ORDER BY created_at DESC LIMIT 200"

        cur.execute(query, tuple(args))
        rows = [dict(r) for r in cur.fetchall()]
        cur.close()
        conn.close()
        return {'statusCode': 200, 'headers': cors, 'body': json.dumps({'orders': rows}, ensure_ascii=False, default=str)}

    # ── POST: создать заказ за клиента ──
    body = json.loads(event.get('body') or '{}')

    partner_id = body.get('partner_id')
    client_id = body.get('client_id')
    created_by_user_id = body.get('created_by_user_id')
    service_kind = body.get('service_kind', 'meet')  # meet | see_off | territory | delivery
    station = (body.get('station') or '').strip()
    destination = (body.get('destination') or '').strip()
    pickup_address = (body.get('pickup_address') or '').strip()
    arrival_time_str = (body.get('arrival_time') or '').strip()
    bags_count = int(body.get('bags_count', 1))
    full_name = (body.get('full_name') or '').strip()
    phone = (body.get('phone') or '').strip()
    email = (body.get('email') or '').strip()
    train_number = (body.get('train_number') or '').strip()
    notes = (body.get('notes') or '').strip()
    payer = body.get('payer', 'client')
    service_type = body.get('service_type', 'railway')

    if not partner_id or not client_id or not station or not full_name or not phone or not email:
        cur.close(); conn.close()
        return {'statusCode': 400, 'headers': cors, 'body': json.dumps({'error': 'Заполните все обязательные поля (включая email)'})}

    arrival_time = None
    if arrival_time_str:
        try:
            arrival_time = datetime.fromisoformat(arrival_time_str)
        except ValueError:
            pass

    cur.execute(
        """
        INSERT INTO baggage_orders (
            full_name, phone, email, train_number, arrival_time, station, bags_count, notes,
            status, partner_id, created_by_user_id, service_kind, payer, destination, pickup_address, service_type
        )
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, 'new', %s, %s, %s, %s, %s, %s, %s)
        RETURNING id, created_at
        """,
        (full_name, phone, email, train_number or None, arrival_time, station, bags_count, notes or None,
         partner_id, created_by_user_id, service_kind, payer, destination or None, pickup_address or None, service_type)
    )
    row = cur.fetchone()
    conn.commit()
    cur.close()
    conn.close()

    return {
        'statusCode': 200,
        'headers': cors,
        'body': json.dumps({
            'success': True,
            'order_id': row['id'],
            'created_at': row['created_at'].isoformat() if row['created_at'] else None
        })
    }