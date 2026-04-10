import json
import os
from datetime import datetime


def handler(event: dict, context) -> dict:
    """Создание заявки на сопровождение багажа."""

    cors_headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    }

    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': cors_headers, 'body': ''}

    if event.get('httpMethod') != 'POST':
        return {'statusCode': 405, 'headers': cors_headers, 'body': json.dumps({'error': 'Method not allowed'})}

    import psycopg2

    body = json.loads(event.get('body') or '{}')

    full_name = body.get('full_name', '').strip()
    phone = body.get('phone', '').strip()
    email = body.get('email', '').strip()
    train_number = body.get('train_number', '').strip()
    arrival_time_str = body.get('arrival_time', '').strip()
    station = body.get('station', '').strip()
    bags_count = int(body.get('bags_count', 1))
    notes = body.get('notes', '').strip()

    if not full_name or not phone or not station:
        return {
            'statusCode': 400,
            'headers': cors_headers,
            'body': json.dumps({'error': 'Заполните обязательные поля: ФИО, телефон, станция'})
        }

    arrival_time = None
    if arrival_time_str:
        try:
            arrival_time = datetime.fromisoformat(arrival_time_str)
        except ValueError:
            pass

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()
    cur.execute(
        """
        INSERT INTO baggage_orders (full_name, phone, email, train_number, arrival_time, station, bags_count, notes, status)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, 'new')
        RETURNING id, created_at
        """,
        (full_name, phone, email or None, train_number or None, arrival_time, station, bags_count, notes or None)
    )
    row = cur.fetchone()
    conn.commit()
    cur.close()
    conn.close()

    order_id = row[0]
    created_at = row[1].isoformat() if row[1] else None

    return {
        'statusCode': 200,
        'headers': cors_headers,
        'body': json.dumps({
            'success': True,
            'order_id': order_id,
            'message': f'Заявка №{order_id} принята. Мы свяжемся с вами в ближайшее время.',
            'created_at': created_at
        })
    }