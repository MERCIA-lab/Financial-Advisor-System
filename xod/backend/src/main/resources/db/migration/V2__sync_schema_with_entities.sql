-- Fix schema to match backend entity definitions
-- This migration updates existing tables so the application can map fields correctly.

ALTER TABLE financial_advisor
  ADD COLUMN IF NOT EXISTS first_name VARCHAR(255),
  ADD COLUMN IF NOT EXISTS last_name VARCHAR(255),
  ADD COLUMN IF NOT EXISTS address VARCHAR(255);

UPDATE financial_advisor
SET first_name = split_part(name, ' ', 1),
    last_name = CASE WHEN name LIKE '% %' THEN substr(name, strpos(name, ' ') + 1) ELSE '' END,
    address = COALESCE(address, 'Unknown')
WHERE first_name IS NULL OR last_name IS NULL OR address IS NULL;

ALTER TABLE client
  ADD COLUMN IF NOT EXISTS first_name VARCHAR(255),
  ADD COLUMN IF NOT EXISTS last_name VARCHAR(255),
  ADD COLUMN IF NOT EXISTS address VARCHAR(255);

UPDATE client
SET first_name = split_part(name, ' ', 1),
    last_name = CASE WHEN name LIKE '% %' THEN substr(name, strpos(name, ' ') + 1) ELSE '' END,
    address = COALESCE(address, 'Unknown')
WHERE first_name IS NULL OR last_name IS NULL OR address IS NULL;

ALTER TABLE portfolio
  ADD COLUMN IF NOT EXISTS creation_date TIMESTAMP;

UPDATE portfolio
SET creation_date = COALESCE(creation_date, created_at, NOW())
WHERE creation_date IS NULL;
