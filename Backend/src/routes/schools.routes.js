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
        SELECT id, name, email, phone, address, created_at
        FROM schools
        ORDER BY name ASC
      `;

      const result = await db.query(queryText);

      res.json({
        success: true,
        data: result.rows
      });
    } catch (error) {
      console.error('Error fetching schools:', error);
      res.status(500).json({
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
        SELECT id, name, email, phone, address, created_at
        FROM schools
        WHERE id = $1
      `;

      const result = await db.query(queryText, [id]);

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'School not found'
        });
      }

      res.json({
        success: true,
        data: result.rows[0]
      });
    } catch (error) {
      console.error('Error fetching school:', error);
      res.status(500).json({
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
        // Demo mode - return sample branches
        const demoBranches = [
          {
            id: "c1000000-0000-0000-0000-000000000001",
            school_id: schoolId,
            name: "Main Campus",
            code: "MAIN",
            physical_address: "Parklands Road, Off Limuru Road, Nairobi",
            phone_number: "+254712345678",
            email: "main@greenfieldacademy.ac.ke",
            is_main_campus: true,
            is_active: true,
            created_at: "2026-02-27 15:40:13.733902+00",
            updated_at: "2026-02-27 15:40:13.733902+00"
          },
          {
            id: "c1000000-0000-0000-0000-000000000002",
            school_id: schoolId,
            name: "Westlands Campus",
            code: "WEST",
            physical_address: "Westlands Avenue, Westlands, Nairobi",
            phone_number: "+254712345679",
            email: "westlands@greenfieldacademy.ac.ke",
            is_main_campus: false,
            is_active: true,
            created_at: "2026-02-27 15:40:13.733902+00",
            updated_at: "2026-02-27 15:40:13.733902+00"
          }
        ];

        return res.json({
          success: true,
          data: demoBranches.filter(b => b.school_id === schoolId)
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

      res.json({
        success: true,
        data: result.rows
      });
    } catch (error) {
      console.error('Error fetching branches:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch branches',
        error: error.message
      });
    }
  }
);

module.exports = router;
