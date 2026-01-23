-- Extend ean column length in invoice_t table to support longer EAN codes
ALTER TABLE invoice_t ALTER COLUMN ean TYPE varchar(20);
