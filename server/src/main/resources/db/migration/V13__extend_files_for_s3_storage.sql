-- Extend files table for S3-backed binary storage
ALTER TABLE files
    RENAME COLUMN files TO file_name;

ALTER TABLE files
    ADD COLUMN file_path VARCHAR(2048),
    ADD COLUMN content_type VARCHAR(200),
    ADD COLUMN size_bytes BIGINT;
