import json
import os
from datetime import datetime


def handler(event: dict, context) -> dict:
    """API личного кабинета: поиск клиента по email и история заказов."""

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
    email = (params.get('email') or '').strip().lower()

    if not email:
        return {
            'statusCode': 400,
            'headers': cors,
            'body': json.dumps({'error': 'Email обязателен'})
        }

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

    # Ищем или создаём клиента
    cur.execute("SELECT * FROM clients WHERE email = %s", (email,))
    client = cur.fetchone()

    if not client:
        # Создаём нового клиента автоматически по email
        cur.execute(
            """
            INSERT INTO clients (full_name, email, phone)
            VALUES (%s, %s, %s)
            RETURNING *
            """,
            (email.split('@')[0].title(), email, None)
        )
        client = cur.fetchone()
        conn.commit()

    client_dict = dict(client)
    if client_dict.get('created_at'):
        client_dict['created_at'] = client_dict['created_at'].isoformat()

    # История заказов по email
    cur.execute(
        """
        SELECT
            id,
            full_name,
            station,
            bags_count,
            arrival_time,
            status,
            payment_status,
            payment_amount,
            service_type,
            train_number,
            notes,
            created_at
        FROM baggage_orders
        WHERE email = %s
        ORDER BY created_at DESC
        LIMIT 50
        """,
        (email,)
    )
    orders_raw = cur.fetchall()
    cur.close()
    conn.close()

    orders = []
    for o in orders_raw:
        row = dict(o)
        if row.get('arrival_time'):
            row['arrival_time'] = row['arrival_time'].isoformat()
        if row.get('created_at'):
            row['created_at'] = row['created_at'].isoformat()
        orders.append(row)

    return {
        'statusCode': 200,
        'headers': cors,
        'body': json.dumps({
            'client': client_dict,
            'orders': orders,
            'orders_count': len(orders)
        }, ensure_ascii=False)
    }
