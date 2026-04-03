-- Migration: Add photo column to teachers table
-- Purpose: Store staff photo URLs from Supabase Storage

BEGIN;

-- Add photo column to teachers table if it doesn't exist
ALTER TABLE teachers ADD COLUMN IF NOT EXISTS photo TEXT;

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_teachers_photo ON teachers(photo) WHERE photo IS NOT NULL;

-- Add comment explaining the column
COMMENT ON COLUMN teachers.photo IS 'URL to staff photo stored in Supabase Storage (staff-images bucket)';

COMMIT;
