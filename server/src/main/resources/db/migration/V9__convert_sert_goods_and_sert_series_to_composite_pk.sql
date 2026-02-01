-- Convert sert_goods and sert_series to composite primary key (uid_sert, uid_good) and (uid_sert, uid_series)
-- This removes redundant uid column and simplifies the model

-- Drop old unique indexes (they will be replaced by PK)
DROP INDEX IF EXISTS uk_sert_goods_unique;
DROP INDEX IF EXISTS uk_sert_series_unique;

-- Drop triggers (they reference old columns)
DROP TRIGGER IF EXISTS update_sert_goods_modtime ON sert_goods;
DROP TRIGGER IF EXISTS update_sert_series_modtime ON sert_series;

-- Convert sert_goods table
ALTER TABLE sert_goods DROP CONSTRAINT sert_goods_pkey;
ALTER TABLE sert_goods DROP COLUMN uid;

-- Add composite primary key
ALTER TABLE sert_goods ADD CONSTRAINT sert_goods_pkey 
PRIMARY KEY (uid_sert, uid_good);

-- Convert sert_series table  
ALTER TABLE sert_series DROP CONSTRAINT sert_series_pkey;
ALTER TABLE sert_series DROP COLUMN uid;

-- Add composite primary key
ALTER TABLE sert_series ADD CONSTRAINT sert_series_pkey 
PRIMARY KEY (uid_sert, uid_series);

-- Recreate triggers (they work with the new structure)
CREATE TRIGGER update_sert_goods_modtime
BEFORE UPDATE ON sert_goods
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_sert_series_modtime
BEFORE UPDATE ON sert_series
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

-- Update comments
COMMENT ON TABLE sert_goods IS 'Связь между сертификатами и товарами (композитный PK)';
COMMENT ON COLUMN sert_goods.uid_sert IS 'Ссылка на сертификат (часть PK)';
COMMENT ON COLUMN sert_goods.uid_good IS 'Ссылка на товар (часть PK)';

COMMENT ON TABLE sert_series IS 'Связь между сертификатами и сериями (композитный PK)';
COMMENT ON COLUMN sert_series.uid_sert IS 'Ссылка на сертификат (часть PK)';
COMMENT ON COLUMN sert_series.uid_series IS 'Ссылка на серию (часть PK)';
