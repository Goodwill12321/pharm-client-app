-- Add good_uid column to series table for direct reference to goods
-- This allows series to be directly linked to a specific product

-- Add the column
ALTER TABLE series ADD COLUMN good_uid VARCHAR(36);

-- Add foreign key constraint to goods table
ALTER TABLE series ADD CONSTRAINT fk_series_good 
FOREIGN KEY (good_uid) REFERENCES goods(uid) ON DELETE SET NULL;

-- Add index for better performance on queries filtering by good_uid
CREATE INDEX idx_series_good_uid ON series(good_uid);

-- Add comment
COMMENT ON COLUMN series.good_uid IS 'Ссылка на товар (UID из таблицы goods)';
COMMENT ON TABLE series IS 'Серии товаров с возможностью прямой привязки к товару';
