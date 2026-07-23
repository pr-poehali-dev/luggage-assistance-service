-- Партнёры (банки, турфирмы, консьерж-сервисы)
CREATE TABLE IF NOT EXISTS partners (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  partner_type VARCHAR(50) DEFAULT 'bank',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Уровни лояльности партнёра
CREATE TABLE IF NOT EXISTS loyalty_levels (
  id SERIAL PRIMARY KEY,
  partner_id INTEGER NOT NULL REFERENCES partners(id),
  name VARCHAR(100) NOT NULL,
  limit_type VARCHAR(20) NOT NULL DEFAULT 'money',
  limit_month NUMERIC(12,2),
  limit_year NUMERIC(12,2),
  is_unlimited BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Пользователи ЛК партнёра (операторы и администраторы)
CREATE TABLE IF NOT EXISTS partner_users (
  id SERIAL PRIMARY KEY,
  partner_id INTEGER NOT NULL REFERENCES partners(id),
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'operator',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Привязка клиента к партнёру и уровню лояльности + остатки лимитов
CREATE TABLE IF NOT EXISTS client_loyalty (
  id SERIAL PRIMARY KEY,
  client_id INTEGER NOT NULL REFERENCES clients(id),
  partner_id INTEGER NOT NULL REFERENCES partners(id),
  loyalty_level_id INTEGER REFERENCES loyalty_levels(id),
  balance_money NUMERIC(12,2),
  balance_services INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(client_id, partner_id)
);

-- Расширяем клиентов
ALTER TABLE clients
  ADD COLUMN IF NOT EXISTS surname VARCHAR(255);

CREATE UNIQUE INDEX IF NOT EXISTS idx_clients_phone_unique ON clients(phone) WHERE phone IS NOT NULL;

-- Расширяем заказы под партнёрский функционал
ALTER TABLE baggage_orders
  ADD COLUMN IF NOT EXISTS partner_id INTEGER REFERENCES partners(id),
  ADD COLUMN IF NOT EXISTS created_by_user_id INTEGER REFERENCES partner_users(id),
  ADD COLUMN IF NOT EXISTS service_kind VARCHAR(30) DEFAULT 'meet',
  ADD COLUMN IF NOT EXISTS payer VARCHAR(20) DEFAULT 'client',
  ADD COLUMN IF NOT EXISTS destination VARCHAR(255),
  ADD COLUMN IF NOT EXISTS pickup_address VARCHAR(255);

INSERT INTO partners (name, partner_type)
VALUES ('Демо Банк', 'bank')
ON CONFLICT DO NOTHING;
