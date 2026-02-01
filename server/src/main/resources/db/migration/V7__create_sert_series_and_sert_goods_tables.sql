-- Create sert_series table
CREATE TABLE IF NOT EXISTS sert_series (
    uid VARCHAR(36) NOT NULL,
    uid_sert VARCHAR(36) NOT NULL,
    uid_series VARCHAR(36) NOT NULL,
    create_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_del BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (uid),
    CONSTRAINT fk_sert_series_sert FOREIGN KEY (uid_sert) REFERENCES sert(uid) ON DELETE CASCADE,
    CONSTRAINT fk_sert_series_series FOREIGN KEY (uid_series) REFERENCES series(uid) ON DELETE CASCADE
);

-- Add index for better performance on foreign keys
CREATE INDEX IF NOT EXISTS idx_sert_series_sert ON sert_series(uid_sert);
CREATE INDEX IF NOT EXISTS idx_sert_series_series ON sert_series(uid_series);

-- Create unique constraint to prevent duplicate relationships
CREATE UNIQUE INDEX IF NOT EXISTS uk_sert_series_unique ON sert_series(uid_sert, uid_series) WHERE is_del = FALSE;

-- Create sert_goods table
CREATE TABLE IF NOT EXISTS sert_goods (
    uid VARCHAR(36) NOT NULL,
    uid_sert VARCHAR(36) NOT NULL,
    uid_good VARCHAR(36) NOT NULL,
    create_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_del BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (uid),
    CONSTRAINT fk_sert_goods_sert FOREIGN KEY (uid_sert) REFERENCES sert(uid) ON DELETE CASCADE,
    CONSTRAINT fk_sert_goods_good FOREIGN KEY (uid_good) REFERENCES goods(uid) ON DELETE CASCADE
);

-- Add index for better performance on foreign keys
CREATE INDEX IF NOT EXISTS idx_sert_goods_sert ON sert_goods(uid_sert);
CREATE INDEX IF NOT EXISTS idx_sert_goods_good ON sert_goods(uid_good);

-- Create unique constraint to prevent duplicate relationships
CREATE UNIQUE INDEX IF NOT EXISTS uk_sert_goods_unique ON sert_goods(uid_sert, uid_good) WHERE is_del = FALSE;

-- Create trigger function to update update_time on row modification
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.update_time = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for sert_series
CREATE TRIGGER update_sert_series_modtime
BEFORE UPDATE ON sert_series
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

-- Create triggers for sert_goods
CREATE TRIGGER update_sert_goods_modtime
BEFORE UPDATE ON sert_goods
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

-- Add comments to tables and columns
COMMENT ON TABLE sert_series IS 'Связь между сертификатами и сериями';
COMMENT ON COLUMN sert_series.uid IS 'Уникальный идентификатор записи';
COMMENT ON COLUMN sert_series.uid_sert IS 'Ссылка на сертификат';
COMMENT ON COLUMN sert_series.uid_series IS 'Ссылка на серию';
COMMENT ON COLUMN sert_series.create_time IS 'Время создания записи';
COMMENT ON COLUMN sert_series.update_time IS 'Время последнего обновления записи';
COMMENT ON COLUMN sert_series.is_del IS 'Признак удаленной записи';

COMMENT ON TABLE sert_goods IS 'Связь между сертификатами и товарами';
COMMENT ON COLUMN sert_goods.uid IS 'Уникальный идентификатор записи';
COMMENT ON COLUMN sert_goods.uid_sert IS 'Ссылка на сертификат';
COMMENT ON COLUMN sert_goods.uid_good IS 'Ссылка на товар';
COMMENT ON COLUMN sert_goods.create_time IS 'Время создания записи';
COMMENT ON COLUMN sert_goods.update_time IS 'Время последнего обновления записи';
COMMENT ON COLUMN sert_goods.is_del IS 'Признак удаленной записи';
