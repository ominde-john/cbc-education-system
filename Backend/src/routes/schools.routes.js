const express = require('express');
const { authenticate, authorize } = require('../middleware/auth');
const db = require('../config/database');

const router = express.Router();

// GET /api/schools - Get all schools
router.get('/',
  authenticate,
  async (req, res) => {
    try {
      if (!db || !db.query) {
        return res.json({
          success: true,
          data: [],
          message: 'No database connection - using demo mode'
        });
      }

      const queryText = `
        SELECT 
          id, 
          name, 
          code,
          email, 
          phone_number, 
          physical_address,
          county,
          sub_county,
          ward,
          level,
          school_type,
          is_active,
          created_at
        FROM schools
        WHERE deleted_at IS NULL
        ORDER BY name ASC
      `;

      const result = await db.query(queryText);

      return res.json({
        success: true,
        data: result.rows
      });
    } catch (error) {
      console.error('Error fetching schools:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch schools',
        error: error.message
      });
    }
  }
);

// GET /api/schools/:id - Get single school by ID
router.get('/:id',
  authenticate,
  async (req, res) => {
    try {
      if (!db || !db.query) {
        return res.status(500).json({
          success: false,
          message: 'Database not configured'
        });
      }

      const { id } = req.params;

      const queryText = `
        SELECT 
          id, 
          name, 
          code,
          email, 
          phone_number, 
          physical_address,
          county,
          sub_county,
          ward,
          level,
          school_type,
          is_active,
          created_at
        FROM schools
        WHERE id = $1 AND deleted_at IS NULL
      `;

      const result = await db.query(queryText, [id]);

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'School not found'
        });
      }

      return res.json({
        success: true,
        data: result.rows[0]
      });
    } catch (error) {
      console.error('Error fetching school:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch school',
        error: error.message
      });
    }
  }
);

// GET /api/schools/:schoolId/branches - Get branches for a school
router.get('/:schoolId/branches',
  authenticate,
  async (req, res) => {
    try {
      const { schoolId } = req.params;
      const { school_id: userSchoolId, role } = req.user;

      // Check permissions - super_admin can access any school, others only their own
      if (role !== 'super_admin' && schoolId !== userSchoolId) {
        return res.status(403).json({
          success: false,
          message: 'Access denied'
        });
      }

      if (!db || !db.query) {
        // Demo mode - return empty array
        return res.json({
          success: true,
          data: []
        });
      }

      const queryText = `
        SELECT
          id,
          school_id,
          name,
          code,
          physical_address,
          phone_number,
          email,
          is_main_campus,
          is_active,
          created_at,
          updated_at
        FROM branches
        WHERE school_id = $1 AND (deleted_at IS NULL OR deleted_at > NOW())
        ORDER BY is_main_campus DESC, name ASC
      `;

      const result = await db.query(queryText, [schoolId]);

      return res.json({
        success: true,
        data: result.rows
      });
    } catch (error) {
      console.error('Error fetching branches:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch branches',
        error: error.message
      });
    }
  }
);

module.exports = router;
