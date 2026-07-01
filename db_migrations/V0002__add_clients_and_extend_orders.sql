-- Таблица клиентов
CREATE TABLE IF NOT EXISTS clients (
  id SERIAL PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(50),
  client_code VARCHAR(20) UNIQUE NOT NULL DEFAULT 'CL-' || LPAD(nextval('clients_id_seq')::text, 6, '0'),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Расширяем baggage_orders
ALTER TABLE baggage_orders
  ADD COLUMN IF NOT EXISTS client_id INTEGER REFERENCES clients(id),
  ADD COLUMN IF NOT EXISTS service_type VARCHAR(20) DEFAULT 'railway',
  ADD COLUMN IF NOT EXISTS payment_status VARCHAR(30) DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS payment_amount NUMERIC(10,2);
