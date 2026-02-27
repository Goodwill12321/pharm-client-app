-- Refactor model to be image-centric
-- 1) sert: make sertno unique (business key)
-- 2) sert_images: uid is external (uidImage), uid_sert becomes nullable
-- 3) sert_goods/sert_series become links to sert_images (sert_image_goods/sert_image_series)

-- Clean up duplicates in sert table before creating unique index
-- Keep only the latest record for each sertno
DELETE FROM sert 
WHERE uid NOT IN (
    SELECT DISTINCT ON (sertno) uid
    FROM sert
    WHERE sertno IS NOT NULL AND sertno <> ''
    ORDER BY sertno, update_time DESC
);

-- sert: unique by certificate number
CREATE UNIQUE INDEX IF NOT EXISTS uk_sert_sertno
    ON sert(sertno)
    WHERE sertno IS NOT NULL AND sertno <> '';

-- sert_images: allow image without certificate
ALTER TABLE sert_images
    ALTER COLUMN uid_sert DROP NOT NULL;

-- sert_images: the link is no longer unique (one certificate may have multiple images)
DROP INDEX IF EXISTS uk_sert_images_uid_sert;

-- Existing data: treat old certificate uid as image uid
-- (previously sert_images.uid_sert referenced sert.uid)
-- Since uid is PK, we need to handle this differently
-- For existing records where uid_sert is not null, we'll keep the current uid as image uid
-- The migration logic should be handled in application layer if needed

-- Series: optional link to certificate
ALTER TABLE IF EXISTS series
    ADD COLUMN IF NOT EXISTS sert_uid varchar(36);

ALTER TABLE  series
    ADD CONSTRAINT  fk_series_sert FOREIGN KEY (sert_uid) REFERENCES sert(uid) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_series_sert_uid ON series(sert_uid);

-- Rename link tables to be image-centric
ALTER TABLE IF EXISTS sert_goods RENAME TO sert_image_goods;
ALTER TABLE IF EXISTS sert_series RENAME TO sert_image_series;

-- Rename FK column uid_sert -> uid_sert_image
ALTER TABLE IF EXISTS sert_image_goods RENAME COLUMN uid_sert TO uid_sert_image;
ALTER TABLE IF EXISTS sert_image_series RENAME COLUMN uid_sert TO uid_sert_image;

-- Drop old FK constraints (names depend on previous migrations)
ALTER TABLE IF EXISTS sert_image_goods DROP CONSTRAINT IF EXISTS fk_sert_goods_sert;
ALTER TABLE IF EXISTS sert_image_series DROP CONSTRAINT IF EXISTS fk_sert_series_sert;

-- Clean up orphaned records in link tables before creating FKs
-- Remove links to non-existent images
DELETE FROM sert_image_goods 
WHERE uid_sert_image IS NOT NULL 
  AND uid_sert_image NOT IN (SELECT uid FROM sert_images);

DELETE FROM sert_image_series 
WHERE uid_sert_image IS NOT NULL 
  AND uid_sert_image NOT IN (SELECT uid FROM sert_images);

-- Recreate FKs to sert_images
ALTER TABLE IF EXISTS sert_image_goods
    ADD CONSTRAINT fk_sert_image_goods_image FOREIGN KEY (uid_sert_image) REFERENCES sert_images(uid) ON DELETE CASCADE;

ALTER TABLE IF EXISTS sert_image_series
    ADD CONSTRAINT fk_sert_image_series_image FOREIGN KEY (uid_sert_image) REFERENCES sert_images(uid) ON DELETE CASCADE;

-- Recreate indexes for renamed columns
DROP INDEX IF EXISTS idx_sert_goods_sert;
DROP INDEX IF EXISTS idx_sert_series_sert;

CREATE INDEX IF NOT EXISTS idx_sert_image_goods_image ON sert_image_goods(uid_sert_image);
CREATE INDEX IF NOT EXISTS idx_sert_image_series_image ON sert_image_series(uid_sert_image);

-- Update comments
COMMENT ON TABLE sert_image_goods IS 'Связь между изображениями сертификатов и товарами (композитный PK)';
COMMENT ON COLUMN sert_image_goods.uid_sert_image IS 'Ссылка на изображение сертификата (часть PK)';

COMMENT ON TABLE sert_image_series IS 'Связь между изображениями сертификатов и сериями (композитный PK)';
COMMENT ON COLUMN sert_image_series.uid_sert_image IS 'Ссылка на изображение сертификата (часть PK)';
