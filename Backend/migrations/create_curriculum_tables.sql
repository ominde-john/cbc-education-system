-- ================================================================
-- Curriculum Tables Migration
-- CBC Curriculum hierarchy: Learning Area → Strand → Sub-Strand → Competency
--
-- Two record types:
--   National  (school_id = NULL)  — CBC standard, shared by all schools
--   Custom    (school_id = uuid)  — school-specific additions
--
-- All deletes are soft (deleted_at)
-- ================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ================================================================
-- 1. Learning Areas Table
-- ================================================================
CREATE TABLE IF NOT EXISTS learning_areas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    school_id UUID REFERENCES schools(id) ON DELETE SET NULL,
    grade_levels TEXT[],  -- Array of grades: ['Grade 1', 'Grade 2', ...]
    is_active BOOLEAN DEFAULT true,
    
    -- Audit fields
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    updated_by UUID REFERENCES users(id) ON DELETE SET NULL,
    deleted_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Index for learning_areas
CREATE INDEX IF NOT EXISTS idx_learning_areas_school_id ON learning_areas(school_id);
CREATE INDEX IF NOT EXISTS idx_learning_areas_code ON learning_areas(code);
CREATE INDEX IF NOT EXISTS idx_learning_areas_deleted_at ON learning_areas(deleted_at) WHERE deleted_at IS NULL;

-- ================================================================
-- 2. Strands Table
-- ================================================================
CREATE TABLE IF NOT EXISTS strands (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    learning_area_id UUID NOT NULL REFERENCES learning_areas(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    
    -- Audit fields
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    updated_by UUID REFERENCES users(id) ON DELETE SET NULL,
    deleted_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    
    -- Unique constraint per learning area
    UNIQUE(learning_area_id, code)
);

-- Index for strands
CREATE INDEX IF NOT EXISTS idx_strands_learning_area_id ON strands(learning_area_id);
CREATE INDEX IF NOT EXISTS idx_strands_deleted_at ON strands(deleted_at) WHERE deleted_at IS NULL;

-- ================================================================
-- 3. Sub-Strands Table
-- ================================================================
CREATE TABLE IF NOT EXISTS sub_strands (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    strand_id UUID NOT NULL REFERENCES strands(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    
    -- Audit fields
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    updated_by UUID REFERENCES users(id) ON DELETE SET NULL,
    deleted_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    
    -- Unique constraint per strand
    UNIQUE(strand_id, code)
);

-- Index for sub_strands
CREATE INDEX IF NOT EXISTS idx_sub_strands_strand_id ON sub_strands(strand_id);
CREATE INDEX IF NOT EXISTS idx_sub_strands_deleted_at ON sub_strands(deleted_at) WHERE deleted_at IS NULL;

-- ================================================================
-- 4. Competencies Table
-- ================================================================
CREATE TABLE IF NOT EXISTS competencies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sub_strand_id UUID NOT NULL REFERENCES sub_strands(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    performance_indicators TEXT[],  -- Array of rubric descriptors
    is_active BOOLEAN DEFAULT true,
    
    -- Audit fields
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    updated_by UUID REFERENCES users(id) ON DELETE SET NULL,
    deleted_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Index for competencies
CREATE INDEX IF NOT EXISTS idx_competencies_sub_strand_id ON competencies(sub_strand_id);
CREATE INDEX IF NOT EXISTS idx_competencies_deleted_at ON competencies(deleted_at) WHERE deleted_at IS NULL;

-- ================================================================
-- Add foreign key from learning_areas to schools (handle NULL for national)
-- ================================================================
DO $$
BEGIN
    -- Add the constraint if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'learning_areas_school_id_fkey' 
        AND table_name = 'learning_areas'
    ) THEN
        ALTER TABLE learning_areas 
        ADD CONSTRAINT learning_areas_school_id_fkey 
        FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE SET NULL;
    END IF;
END $$;

-- ================================================================
-- Comments for documentation
-- ================================================================
COMMENT ON TABLE learning_areas IS 'CBC Learning Areas - can be national (school_id=NULL) or school-specific';
COMMENT ON TABLE strands IS 'CBC Strands under Learning Areas';
COMMENT ON TABLE sub_strands IS 'CBC Sub-Strands under Strands';
COMMENT ON TABLE competencies IS 'CBC Competencies under Sub-Strands with performance indicators';

COMMENT ON COLUMN learning_areas.school_id IS 'NULL for national curriculum, UUID for school-specific custom curriculum';
COMMENT ON COLUMN learning_areas.grade_levels IS 'Array of grade levels this learning area applies to';
COMMENT ON COLUMN competencies.performance_indicators IS 'Array of rubric descriptors for assessment';

