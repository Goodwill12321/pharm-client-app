-- V3__add_unique_index_to_client_contact.sql
-- Добавляет уникальный индекс на (client_uid, contact_uid) в таблице client_contact

CREATE UNIQUE INDEX IF NOT EXISTS uniq_client_contact ON client_contact(client_uid, contact_uid); 