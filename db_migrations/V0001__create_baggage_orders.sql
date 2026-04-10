CREATE TABLE IF NOT EXISTS baggage_orders (
  id SERIAL PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  email VARCHAR(255),
  train_number VARCHAR(50),
  arrival_time TIMESTAMP,
  station VARCHAR(255) NOT NULL,
  bags_count INTEGER DEFAULT 1,
  notes TEXT,
  status VARCHAR(50) DEFAULT 'new',
  created_at TIMESTAMP DEFAULT NOW()
);
