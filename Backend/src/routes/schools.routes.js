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

module.exports = router;
