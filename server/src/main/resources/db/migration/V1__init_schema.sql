-- Расширение для генерации uuid
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Таблица client
CREATE TABLE IF NOT EXISTS client (
    uid varchar(36) PRIMARY KEY,
    code varchar(20),
    name varchar(200),
    delivery_address varchar(300),
    ul varchar(36),
    email_info varchar(100),
    email_nakl varchar(100),
    status varchar(1000),
    inn varchar(12),
    kpp varchar(10),
    filial_uid varchar(36),
    constraint_flag boolean,
    create_time timestamp DEFAULT CURRENT_TIMESTAMP,
    update_time timestamp DEFAULT CURRENT_TIMESTAMP,
    is_del boolean
);

-- Таблица ul
CREATE TABLE IF NOT EXISTS ul (
    uid varchar(36) PRIMARY KEY,
    code varchar(20),
    name varchar(200),
    address varchar(300),
    inn varchar(12),
    kpp varchar(10),
    status varchar(1000),
    constraint_flag boolean,
    create_time timestamp DEFAULT CURRENT_TIMESTAMP,
    update_time timestamp DEFAULT CURRENT_TIMESTAMP,
    is_del boolean
);

-- Таблица clame_h
CREATE TABLE IF NOT EXISTS clame_h (
    uid varchar(36) PRIMARY KEY DEFAULT (gen_random_uuid()::text),
    uid_us varchar(36),
    uid_doc_osn varchar(36),
    code varchar(20),
    docnum varchar(20),
    docdate timestamp,
    client_uid varchar(36),
    comment varchar(1000),
    status varchar(50),
    create_time timestamp DEFAULT CURRENT_TIMESTAMP,
    update_time timestamp DEFAULT CURRENT_TIMESTAMP,
    is_del boolean
);

-- Таблица clame_t
CREATE TABLE IF NOT EXISTS clame_t (
    uid_line varchar(36) PRIMARY KEY DEFAULT (gen_random_uuid()::text),
    uid varchar(36),
    uid_line_doc_osn varchar(36),
    good_uid varchar(36),
    series_uid varchar(36),
    qnt double precision,
    type_clame varchar(36),
    comment varchar(1000),
    result varchar(1000)
);

-- Таблица client_contact
CREATE TABLE IF NOT EXISTS client_contact (
    uid varchar(36) PRIMARY KEY,
    client_uid varchar(36),
    contact_uid varchar(36)
);

-- Таблица files
CREATE TABLE IF NOT EXISTS files (
    uid varchar(36) PRIMARY KEY DEFAULT (gen_random_uuid()::text),
    files varchar(200)
);

-- Таблица files_clame
CREATE TABLE IF NOT EXISTS files_clame (
    id serial PRIMARY KEY,
    uid_clame varchar(36),
    uid_file varchar(36)
);

-- Таблица invoice_h
CREATE TABLE IF NOT EXISTS invoice_h (
    uid varchar(36) PRIMARY KEY,
    type_uid varchar(36),
    docnum varchar(20),
    docdate timestamp,
    ndssum double precision,
    sumnonds double precision,
    sumsnds double precision,
    client_uid varchar(36),
    status varchar(50),
    comment varchar(200),
    status_buh varchar(50),
    filial varchar(36),
    create_time timestamp DEFAULT CURRENT_TIMESTAMP,
    update_time timestamp DEFAULT CURRENT_TIMESTAMP,
    is_del boolean
);

-- Таблица invoice_t
CREATE TABLE IF NOT EXISTS invoice_t (
    uid_line varchar(36) PRIMARY KEY,
    uid varchar(36),
    good_uid varchar(36),
    series_uid varchar(36),
    price double precision,
    qnt double precision,
    nds double precision,
    ndssum double precision,
    sumnonds double precision,
    sumsnds double precision,
    gtin varchar(30),
    ean varchar(13),
    date_sale_producer timestamp,
    price_reestr double precision,
    price_producer double precision
);

-- Таблица messages
CREATE TABLE IF NOT EXISTS messages (
    uid varchar(36) PRIMARY KEY DEFAULT (gen_random_uuid()::text),
    object_uid varchar(36) NOT NULL,
    object_type varchar(100) NOT NULL,
    create_time timestamp DEFAULT CURRENT_TIMESTAMP,
    update_time timestamp DEFAULT CURRENT_TIMESTAMP,
    read_time timestamp,
    sender varchar(36),
    session_uid varchar(36),
    message varchar(2000)
);

-- Таблица clame_type
CREATE TABLE IF NOT EXISTS clame_type (
    uid varchar(36) PRIMARY KEY,
    name varchar(100)
);

-- Таблица client_manager
CREATE TABLE IF NOT EXISTS client_manager (
    id serial PRIMARY KEY,
    client_uid varchar(36),
    staff_uid varchar(36),
    goods_type_uid varchar(36),
    is_main boolean
);

-- Таблица contact
CREATE TABLE IF NOT EXISTS contact (
    uid varchar(36) PRIMARY KEY,
    name varchar(150),
    login varchar(30),
    password varchar(30),
    debitorka boolean,
    claims boolean,
    fio varchar(200),
    phone varchar(100),
    email varchar(200),
    function varchar(500),
    salt varchar(20),
    create_time timestamp DEFAULT CURRENT_TIMESTAMP,
    update_time timestamp DEFAULT CURRENT_TIMESTAMP,
    is_del boolean
);

-- Таблица debitorka
CREATE TABLE IF NOT EXISTS debitorka (
    id serial PRIMARY KEY,
    doc_uid varchar(36),
    ul_uid varchar(36),
    Otsrochka_Day integer,
    Pay_Date date,
    Ostatok_Day integer,
    Prosrochka_Day integer,
    Sum_Doc double precision,
    Sum_Paid double precision,
    Sum_Dolg double precision,
    CONSTRAINT fk_ul_uid FOREIGN KEY (ul_uid) REFERENCES ul(uid)
);

-- Таблица document_type
CREATE TABLE IF NOT EXISTS document_type (
    uid varchar(36) PRIMARY KEY,
    name varchar(50)
);

-- Таблица filials
CREATE TABLE IF NOT EXISTS filials (
    uid varchar(36) PRIMARY KEY,
    name varchar(150)
);

-- Таблица goods
CREATE TABLE IF NOT EXISTS goods (
    uid varchar(36) PRIMARY KEY,
    name varchar(500),
    name_min varchar(150),
    producer varchar(150),
    country varchar(150),
    gv boolean,
    mark boolean,
    mark_type varchar(50),
    mnn varchar(300),
    temperature_mode varchar(30),
    create_time timestamp DEFAULT CURRENT_TIMESTAMP,
    update_time timestamp DEFAULT CURRENT_TIMESTAMP,
    is_del boolean
);

-- Таблица goods_type
CREATE TABLE IF NOT EXISTS goods_type (
    uid varchar(36) PRIMARY KEY,
    name varchar(200)
);

-- Таблица result_claim
CREATE TABLE IF NOT EXISTS result_claim (
    uid varchar(36) PRIMARY KEY,
    name varchar(100)
);

-- Таблица series
CREATE TABLE IF NOT EXISTS series (
    uid varchar(36) PRIMARY KEY,
    name varchar(50),
    date_expbefore timestamp,
    date_production timestamp,
    create_time timestamp DEFAULT CURRENT_TIMESTAMP,
    update_time timestamp DEFAULT CURRENT_TIMESTAMP,
    is_del boolean
);

-- Таблица sert
CREATE TABLE IF NOT EXISTS sert (
    uid varchar(36) PRIMARY KEY,
    image varchar(300),
    sertno varchar(50),
    image_loaded boolean,
    create_time timestamp DEFAULT CURRENT_TIMESTAMP,
    update_time timestamp DEFAULT CURRENT_TIMESTAMP,
    is_del boolean
);

-- Таблица staff
CREATE TABLE IF NOT EXISTS staff (
    uid varchar(36) PRIMARY KEY,
    code varchar(20),
    name varchar(200),
    email varchar(200),
    phone_num varchar(20),
    phone_num_ext varchar(10),
    function varchar(100),
    create_time timestamp DEFAULT CURRENT_TIMESTAMP,
    update_time timestamp DEFAULT CURRENT_TIMESTAMP,
    is_del boolean
);

-- Триггеры для update_time
CREATE OR REPLACE FUNCTION set_update_time()
RETURNS TRIGGER AS $$
BEGIN
  NEW.update_time = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Применить триггер для всех таблиц с update_time
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN SELECT table_name FROM information_schema.columns WHERE column_name = 'update_time' AND table_schema = 'public' LOOP
        EXECUTE format('DROP TRIGGER IF EXISTS trg_set_update_time ON %I', r.table_name);
        EXECUTE format('CREATE TRIGGER trg_set_update_time BEFORE UPDATE ON %I FOR EACH ROW EXECUTE FUNCTION set_update_time()', r.table_name);
    END LOOP;
END $$;
