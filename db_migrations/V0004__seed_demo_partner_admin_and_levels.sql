-- Демо-администратор для входа в ЛК партнёра (email: admin@demobank.ru, пароль: partner123)
INSERT INTO partner_users (partner_id, full_name, email, password_hash, role)
VALUES (1, 'Администратор Демо Банка', 'admin@demobank.ru', 'porter_salt_v1:938b9933cd6964b6b280cc41bbb24c33b690d91ffbae92c74348a9bb190eaef7', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Демо-уровни лояльности
INSERT INTO loyalty_levels (partner_id, name, limit_type, limit_month, limit_year, is_unlimited)
VALUES
  (1, 'ТБ1', 'money', 4000, 20000, false),
  (1, 'ТБ2', 'money', 8000, 40000, false),
  (1, 'ТБ3', 'services', NULL, NULL, true)
ON CONFLICT DO NOTHING;
