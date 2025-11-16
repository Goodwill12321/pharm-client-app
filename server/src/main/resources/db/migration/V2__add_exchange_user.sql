-- Добавление пользователя для обмена с 1С
INSERT INTO contact (
    uid, name, login, password, debitorka, claims, fio, phone, email, function, salt, create_time, update_time, is_del
) VALUES (
    gen_random_uuid()::text,
    '1C Exchange',
    'exchange_1c',
    '$2a$12$SYYBfYqnaRy9XN9A4.tXmuYsmTxC8J.jXP222XZ7Z03C2tmfHlTJ.',
    false, false, '1C Exchange', '', '', '', '', NOW(), NOW(), false
)
ON CONFLICT (login) DO NOTHING; 