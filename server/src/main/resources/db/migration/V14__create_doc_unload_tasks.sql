CREATE TABLE IF NOT EXISTS doc_unload_tasks (
    uid varchar(36) PRIMARY KEY DEFAULT (gen_random_uuid()::text),
    request_time timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    contact_uid varchar(36) NOT NULL,
    doc_type varchar(100) NOT NULL,
    doc_uid varchar(36) NOT NULL,
    docnum varchar(20),
    docdate timestamp,
    is_unloaded boolean NOT NULL DEFAULT false,
    unload_time timestamp,
    status_update_time timestamp,
    unload_comment varchar(1000),
    create_time timestamp DEFAULT CURRENT_TIMESTAMP,
    update_time timestamp DEFAULT CURRENT_TIMESTAMP,
    is_del boolean DEFAULT false
);

CREATE INDEX IF NOT EXISTS idx_doc_unload_tasks_contact_request_time ON doc_unload_tasks (contact_uid, request_time DESC);
CREATE INDEX IF NOT EXISTS idx_doc_unload_tasks_doc_uid_request_time ON doc_unload_tasks (doc_uid, request_time DESC);
CREATE INDEX IF NOT EXISTS idx_doc_unload_tasks_docnum ON doc_unload_tasks (docnum);
CREATE INDEX IF NOT EXISTS idx_doc_unload_tasks_pending ON doc_unload_tasks (is_unloaded, request_time);

DROP TRIGGER IF EXISTS trg_set_update_time ON doc_unload_tasks;
CREATE TRIGGER trg_set_update_time
    BEFORE UPDATE ON doc_unload_tasks
    FOR EACH ROW
    EXECUTE FUNCTION set_update_time();
