-- Add create_time and update_time columns to tables that don't have them
-- Tables: clame_t, client_contact, client_manager, debitorka, files, files_clame, filials, invoice_t, result_claim

-- Add columns to clame_t table
ALTER TABLE clame_t 
ADD COLUMN create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- Create trigger for clame_t table

CREATE TRIGGER trigger_update_clame_t_update_time
    BEFORE UPDATE ON clame_t
    FOR EACH ROW
    EXECUTE FUNCTION set_update_time();

-- Add columns to client_contact table
ALTER TABLE client_contact 
ADD COLUMN create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- Create trigger for client_contact table

CREATE TRIGGER trigger_update_client_contact_update_time
    BEFORE UPDATE ON client_contact
    FOR EACH ROW
    EXECUTE FUNCTION set_update_time();

-- Add columns to client_manager table
ALTER TABLE client_manager 
ADD COLUMN create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- Create trigger for client_manager table

CREATE TRIGGER trigger_update_client_manager_update_time
    BEFORE UPDATE ON client_manager
    FOR EACH ROW
    EXECUTE FUNCTION set_update_time();

-- Add columns to debitorka table
ALTER TABLE debitorka 
ADD COLUMN create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- Create trigger for debitorka table

CREATE TRIGGER trigger_update_debitorka_update_time
    BEFORE UPDATE ON debitorka
    FOR EACH ROW
    EXECUTE FUNCTION set_update_time();

-- Add columns to files table
ALTER TABLE files 
ADD COLUMN create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- Create trigger for files table

CREATE TRIGGER trigger_update_files_update_time
    BEFORE UPDATE ON files
    FOR EACH ROW
    EXECUTE FUNCTION set_update_time();

-- Add columns to files_clame table
ALTER TABLE files_clame 
ADD COLUMN create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- Create trigger for files_clame table

CREATE TRIGGER trigger_update_files_clame_update_time
    BEFORE UPDATE ON files_clame
    FOR EACH ROW
    EXECUTE FUNCTION set_update_time();

-- Add columns to filials table
ALTER TABLE filials 
ADD COLUMN create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- Create trigger for filials table

CREATE TRIGGER trigger_update_filials_update_time
    BEFORE UPDATE ON filials
    FOR EACH ROW
    EXECUTE FUNCTION set_update_time();

-- Add columns to invoice_t table
ALTER TABLE invoice_t 
ADD COLUMN create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- Create trigger for invoice_t table

CREATE TRIGGER trigger_update_invoice_t_update_time
    BEFORE UPDATE ON invoice_t
    FOR EACH ROW
    EXECUTE FUNCTION set_update_time();

-- Add columns to result_claim table
ALTER TABLE result_claim 
ADD COLUMN create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- Create trigger for result_claim table

CREATE TRIGGER trigger_update_result_claim_update_time
    BEFORE UPDATE ON result_claim
    FOR EACH ROW
    EXECUTE FUNCTION set_update_time();
