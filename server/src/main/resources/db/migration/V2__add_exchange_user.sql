-- Добавление пользователя для обмена с 1С
INSERT INTO contact (
    uid, name, login, password, debitorka, claims, fio, phone, email, function, salt, create_time, update_time, is_del
) VALUES (
    gen_random_uuid()::text,
    '1C Exchange',
    'exchange_1c',
    '$2a$12$MuQG70K3jqyFV3vpLUOx2uE0WNMyDvR3ds7ROtLeMInsCTkdAfhym',
    false, false, '1C Exchange', '', '', '', '', NOW(), NOW(), false
)
ON CONFLICT (login) DO NOTHING; 