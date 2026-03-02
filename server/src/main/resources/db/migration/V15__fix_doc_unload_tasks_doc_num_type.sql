-- Fix doc_num type from bytea to text in doc_unload_tasks
-- This resolves PostgreSQL lower(bytea) errors and makes the field usable for string operations.

ALTER TABLE doc_unload_tasks
  ALTER COLUMN docnum TYPE text USING docnum::text;

-- Optional: add comment to clarify expected usage
COMMENT ON COLUMN doc_unload_tasks.docnum IS 'Document number (text, searchable)';
