const express = require('express');
const router = express.Router();
const {
  getTerms,
  getTermById,
  getCurrentTerm,
  createTerm,
  updateTerm,
  setCurrentTerm,
  toggleTermStatus,
  deleteTerm,
} = require('../controllers/academicTermsController');

const { authenticate, authorize, auditLog, securityHeaders } = require('../middleware/auth');

// Apply security headers to all routes
router.use(securityHeaders);

// All routes require authentication
router.use(authenticate);

// ─── Public (authenticated) reads ────────────────────────────────────────────

// GET /api/v1/academic-terms/school/:school_id          → all terms for a school
router.get('/school/:school_id', getTerms);

// GET /api/v1/academic-terms/school/:school_id/current  → current active term
router.get('/school/:school_id/current', getCurrentTerm);

// GET /api/v1/academic-terms/:id                        → single term by ID
router.get('/:id', getTermById);

// ─── Admin-only writes ────────────────────────────────────────────────────────

// POST /api/v1/academic-terms                           → create new term
router.post('/', authorize('school_admin', 'super_admin'), createTerm);

// PUT /api/v1/academic-terms/:id                        → update term
router.put('/:id', authorize('school_admin', 'super_admin'), updateTerm);

// PATCH /api/v1/academic-terms/:id/set-current          → promote to current
router.patch('/:id/set-current', authorize('school_admin', 'super_admin'), setCurrentTerm);

// PATCH /api/v1/academic-terms/:id/toggle-status        → activate / deactivate
router.patch('/:id/toggle-status', authorize('school_admin', 'super_admin'), toggleTermStatus);

// DELETE /api/v1/academic-terms/:id                     → delete term
router.delete('/:id', authorize('school_admin', 'super_admin'), deleteTerm);

module.exports = router;
