import json
import os
import hashlib
import binascii
import secrets


SALT = 'porter_salt_v1'


def hash_password(password: str) -> str:
    dk = hashlib.pbkdf2_hmac('sha256', password.encode(), SALT.encode(), 100000)
    return SALT + ':' + binascii.hexlify(dk).decode()


def verify_password(password: str, stored_hash: str) -> bool:
    try:
        salt, hex_hash = stored_hash.split(':')
        dk = hashlib.pbkdf2_hmac('sha256', password.encode(), salt.encode(), 100000)
        return binascii.hexlify(dk).decode() == hex_hash
    except Exception:
        return False


def handler(event: dict, context) -> dict:
    """Вход и регистрация пользователей ЛК корпоративного партнёра (операторы и администраторы)."""

    cors = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token',
    }

    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': cors, 'body': ''}

    import psycopg2
    import psycopg2.extras

    method = event.get('httpMethod', 'GET')
    params = event.get('queryStringParameters') or {}
    action = params.get('action', 'login')

    body = {}
    if event.get('body'):
        try:
            body = json.loads(event['body'])
        except Exception:
            body = {}
        action = body.get('action', action)

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

    if method == 'POST' and action == 'login':
        email = (body.get('email') or '').strip().lower()
        password = body.get('password') or ''

        if not email or not password:
            cur.close(); conn.close()
            return {'statusCode': 400, 'headers': cors, 'body': json.dumps({'error': 'Email и пароль обязательны'})}

        cur.execute(
            """
            SELECT pu.*, p.name as partner_name, p.partner_type
            FROM partner_users pu
            JOIN partners p ON p.id = pu.partner_id
            WHERE pu.email = %s
            """,
            (email,)
        )
        user = cur.fetchone()
        cur.close()
        conn.close()

        if not user or not verify_password(password, user['password_hash']):
            return {'statusCode': 401, 'headers': cors, 'body': json.dumps({'error': 'Неверный email или пароль'})}

        token = f"{user['id']}:{secrets.token_hex(16)}"

        return {
            'statusCode': 200,
            'headers': cors,
            'body': json.dumps({
                'success': True,
                'token': token,
                'user': {
                    'id': user['id'],
                    'full_name': user['full_name'],
                    'email': user['email'],
                    'role': user['role'],
                    'partner_id': user['partner_id'],
                    'partner_name': user['partner_name'],
                    'partner_type': user['partner_type'],
                }
            }, ensure_ascii=False)
        }

    if method == 'POST' and action == 'create_user':
        # Администратор создаёт оператора в рамках своего партнёра
        partner_id = body.get('partner_id')
        full_name = (body.get('full_name') or '').strip()
        email = (body.get('email') or '').strip().lower()
        password = body.get('password') or ''
        role = body.get('role', 'operator')

        if not partner_id or not full_name or not email or not password:
            cur.close(); conn.close()
            return {'statusCode': 400, 'headers': cors, 'body': json.dumps({'error': 'Заполните все поля'})}

        try:
            cur.execute(
                """
                INSERT INTO partner_users (partner_id, full_name, email, password_hash, role)
                VALUES (%s, %s, %s, %s, %s)
                RETURNING id, full_name, email, role
                """,
                (partner_id, full_name, email, hash_password(password), role)
            )
            new_user = cur.fetchone()
            conn.commit()
        except psycopg2.errors.UniqueViolation:
            conn.rollback()
            cur.close(); conn.close()
            return {'statusCode': 409, 'headers': cors, 'body': json.dumps({'error': 'Пользователь с таким email уже существует'})}

        cur.close()
        conn.close()
        return {'statusCode': 200, 'headers': cors, 'body': json.dumps({'success': True, 'user': dict(new_user)}, ensure_ascii=False)}

    cur.close()
    conn.close()
    return {'statusCode': 400, 'headers': cors, 'body': json.dumps({'error': 'Неизвестное действие'})}
