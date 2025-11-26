-- V5__add_doc_date_and_computed_columns.sql
-- Добавление поля doc_date и создание вычисляемой колонки Pay_Date

-- 1. Добавляем колонку doc_date для хранения даты накладной
ALTER TABLE debitorka ADD COLUMN doc_date DATE;

-- 2. Заполняем новую колонку данными из таблицы накладных
UPDATE debitorka d 
SET doc_date = DATE(ih.docdate) 
FROM invoice_h ih 
WHERE ih.uid = d.doc_uid;

-- 3. Делаем колонку NOT NULL после заполнения (если есть данные)
--ALTER TABLE debitorka ALTER COLUMN doc_date SET NOT NULL;

-- 4. Обнуляем старые колонки ostatok_day и prosrochka_day
-- Теперь они будут вычисляться на уровне backend через @Formula
UPDATE debitorka SET Ostatok_Day = 0, Prosrochka_Day = 0;

-- 5. Переименовываем существующую колонку Pay_Date для сохранения старых данных (бэкап)
ALTER TABLE debitorka RENAME COLUMN Pay_Date TO Pay_Date_old;

-- 6. Создаем вычисляемую колонку Pay_Date на уровне PostgreSQL
ALTER TABLE debitorka 
ADD COLUMN pay_date date GENERATED ALWAYS AS (doc_date + COALESCE(otsrochka_day, 0) * INTERVAL '1 day') STORED;

-- 7. Создаем индексы для быстрых запросов
CREATE INDEX IF NOT EXISTS idx_debitorka_doc_date ON debitorka(doc_date);
CREATE INDEX IF NOT EXISTS idx_debitorka_pay_date ON debitorka(pay_date);

-- 8. Комментарии для документации
COMMENT ON COLUMN debitorka.doc_date IS 'Дата накладной (из invoice_h.doc_date)';
COMMENT ON COLUMN debitorka.pay_date IS 'Дата оплаты = дата накладной + отсрочка дней (вычисляемое поле STORED)';
COMMENT ON COLUMN debitorka.Ostatok_Day IS 'Дней до оплаты (вычисляется в Java через @Formula, не использовать в прямых SQL запросах)';
COMMENT ON COLUMN debitorka.Prosrochka_Day IS 'Дней просрочки (вычисляется в Java через @Formula, не использовать в прямых SQL запросах)';
