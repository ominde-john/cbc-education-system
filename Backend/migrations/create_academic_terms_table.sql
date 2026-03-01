-- Create academic_terms table if it doesn't exist
CREATE TABLE IF NOT EXISTS academic_terms (
  id SERIAL PRIMARY KEY,
  school_id INTEGER NOT NULL,
  name VARCHAR(255) NOT NULL,
  year INTEGER NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  is_current BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_academic_terms_school_id ON academic_terms(school_id);
CREATE INDEX IF NOT EXISTS idx_academic_terms_year ON academic_terms(year);
CREATE INDEX IF NOT EXISTS idx_academic_terms_is_current ON academic_terms(is_current);
CREATE INDEX IF NOT EXISTS idx_academic_terms_is_active ON academic_terms(is_active);

-- Sample data for school_id = 1 (assuming school with ID 1 exists)
-- Spring Term 2024
INSERT INTO academic_terms (school_id, name, year, start_date, end_date, is_current, is_active, created_at, updated_at)
VALUES (1, 'Spring Term 2024', 2024, '2024-01-15', '2024-04-30', false, true, NOW(), NOW())
ON CONFLICT DO NOTHING;

-- Summer Term 2024
INSERT INTO academic_terms (school_id, name, year, start_date, end_date, is_current, is_active, created_at, updated_at)
VALUES (1, 'Summer Term 2024', 2024, '2024-05-01', '2024-07-31', false, true, NOW(), NOW())
ON CONFLICT DO NOTHING;

-- Fall Term 2024 (Current Term)
INSERT INTO academic_terms (school_id, name, year, start_date, end_date, is_current, is_active, created_at, updated_at)
VALUES (1, 'Fall Term 2024', 2024, '2024-08-01', '2024-12-31', true, true, NOW(), NOW())
ON CONFLICT DO NOTHING;

-- Spring Term 2025
INSERT INTO academic_terms (school_id, name, year, start_date, end_date, is_current, is_active, created_at, updated_at)
VALUES (1, 'Spring Term 2025', 2025, '2025-01-15', '2025-04-30', false, true, NOW(), NOW())
ON CONFLICT DO NOTHING;

-- Inactive Term (for testing toggle-status)
INSERT INTO academic_terms (school_id, name, year, start_date, end_date, is_current, is_active, created_at, updated_at)
VALUES (1, 'Winter Term 2023', 2023, '2023-11-01', '2024-01-14', false, false, NOW(), NOW())
ON CONFLICT DO NOTHING;

-- Sample data for school_id = 2 (another school)
INSERT INTO academic_terms (school_id, name, year, start_date, end_date, is_current, is_active, created_at, updated_at)
VALUES (2, 'Term 1 2024', 2024, '2024-01-10', '2024-03-31', false, true, NOW(), NOW())
ON CONFLICT DO NOTHING;

INSERT INTO academic_terms (school_id, name, year, start_date, end_date, is_current, is_active, created_at, updated_at)
VALUES (2, 'Term 2 2024', 2024, '2024-04-01', '2024-06-30', false, true, NOW(), NOW())
ON CONFLICT DO NOTHING;

INSERT INTO academic_terms (school_id, name, year, start_date, end_date, is_current, is_active, created_at, updated_at)
VALUES (2, 'Term 3 2024', 2024, '2024-07-01', '2024-09-30', false, true, NOW(), NOW())
ON CONFLICT DO NOTHING;

INSERT INTO academic_terms (school_id, name, year, start_date, end_date, is_current, is_active, created_at, updated_at)
VALUES (2, 'Term 4 2024', 2024, '2024-10-01', '2024-12-31', true, true, NOW(), NOW())
ON CONFLICT DO NOTHING;

-- Verify the data
SELECT * FROM academic_terms ORDER BY school_id, year, start_date;
