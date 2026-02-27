-- Create sert_images table (images moved out from sert)
CREATE TABLE IF NOT EXISTS sert_images (
    uid varchar(36) PRIMARY KEY DEFAULT (gen_random_uuid()::text),
    uid_sert varchar(36) NOT NULL,
    image varchar(300) NOT NULL,
    image_loaded boolean,
    create_time timestamp DEFAULT CURRENT_TIMESTAMP,
    update_time timestamp DEFAULT CURRENT_TIMESTAMP,
    is_del boolean,
    CONSTRAINT fk_sert_images_sert FOREIGN KEY (uid_sert) REFERENCES sert(uid) ON DELETE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_sert_images_uid_sert ON sert_images(uid_sert);
CREATE INDEX IF NOT EXISTS idx_sert_images_uid_sert ON sert_images(uid_sert);

CREATE TRIGGER trigger_update_sert_images_update_time
    BEFORE UPDATE ON sert_images
    FOR EACH ROW
    EXECUTE FUNCTION set_update_time();

INSERT INTO sert_images (uid_sert, image, image_loaded, is_del)
SELECT s.uid, s.image, s.image_loaded, s.is_del
FROM sert s
WHERE s.image IS NOT NULL AND s.image <> ''
ON CONFLICT (uid_sert)
DO UPDATE SET
    image = EXCLUDED.image,
    image_loaded = EXCLUDED.image_loaded,
    is_del = EXCLUDED.is_del;
