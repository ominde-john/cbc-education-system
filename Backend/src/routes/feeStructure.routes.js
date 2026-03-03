// ================================================================
// routes/feeStructure.routes.js
//
// Mount in app.js:
//   app.use('/api/v1/fee-structures', feeStructureRoutes)
//
// IMPORTANT — route ORDER matters in Express.
// Specific paths (/summary, /by-grade/:grade, /duplicate-from-year)
// MUST be declared BEFORE the generic /:id route.
// If /:id comes first, Express matches "summary" as an ID param.
// ================================================================

const express = require('express');
const router  = express.Router();

const {
  getFeeStructures,
  getFeesByGrade,
  getFeeStructureById,
  createFeeStructure,
  updateFeeStructure,
  deleteFeeStructure,
  duplicateFromYear,
  getFeesSummary,
} = require('../controllers/feeStructure.controller');

const { authenticate, authorize, securityHeaders } = require('../middleware/auth');

// Apply security headers to all routes
router.use(securityHeaders);

// All fee structure routes require authentication
router.use(authenticate);


// ── SPECIFIC ROUTES FIRST (before /:id) ──────────────────────────

/**
 * GET /api/v1/fee-structures/summary
 * Finance dashboard: totals per grade for current year.
 * Query: ?academic_year_id=xxx
 */
router.get('/summary', getFeesSummary);


/**
 * GET /api/v1/fee-structures/by-grade/:grade
 * Called during learner enrollment to auto-populate invoice.
 * Returns mandatory + optional fees for that grade.
 * Query: ?academic_year_id=xxx (defaults to current year)
 *
 * Example: GET /api/v1/fee-structures/by-grade/Grade%204
 */
router.get('/by-grade/:grade', getFeesByGrade);


/**
 * POST /api/v1/fee-structures/duplicate-from-year
 * "Duplicate from previous year" button on the frontend.
 * Copies all fee structures from source year → target year.
 * School admin only.
 *
 * Body: {
 *   source_academic_year_id: "uuid",
 *   target_academic_year_id: "uuid",
 *   adjust_percentage: 10    ← optional: increase all amounts by 10%
 * }
 */
router.post(
  '/duplicate-from-year',
  authorize('school_admin', 'super_admin'),
  duplicateFromYear
);


// ── COLLECTION ROUTES ─────────────────────────────────────────────

/**
 * GET /api/v1/fee-structures
 * List all fee structures for the school.
 * All authenticated roles can read.
 * Query: ?grade_level=Grade 4
 *        ?category=tuition
 *        ?academic_year_id=xxx
 *        ?is_active=true
 *        ?is_mandatory=true
 */
router.get('/', getFeeStructures);


/**
 * POST /api/v1/fee-structures
 * Create a new fee structure item.
 * School admin only.
 *
 * Body: {
 *   academic_year_id,          required
 *   name,                      required  e.g. "Grade 4 Tuition Fee"
 *   grade_level,               optional  null = applies to all grades
 *   category,                  required  tuition|activity|uniform|...
 *   amount,                    required  e.g. 22000
 *   frequency,                 required  per_term|per_year|once_off|monthly
 *   description,               optional
 *   is_mandatory               optional  default true
 * }
 */
router.post(
  '/',
  authorize('school_admin', 'super_admin'),
  createFeeStructure
);


// ── ITEM ROUTES (/:id must come AFTER specific named routes) ──────

/**
 * GET /api/v1/fee-structures/:id
 * Single fee structure with usage count.
 */
router.get('/:id', getFeeStructureById);


/**
 * PUT /api/v1/fee-structures/:id
 * Update fee structure.
 * Amount change is BLOCKED if active invoices reference this fee.
 *
 * Body: any subset of {
 *   name, grade_level, category, amount,
 *   frequency, description, is_mandatory, is_active
 * }
 */
router.put(
  '/:id',
  authorize('school_admin', 'super_admin'),
  updateFeeStructure
);


/**
 * DELETE /api/v1/fee-structures/:id
 * Soft delete. Blocked if active invoices reference this fee.
 * Use PUT to set is_active=false instead (deactivate without deleting).
 */
router.delete(
  '/:id',
  authorize('school_admin', 'super_admin'),
  deleteFeeStructure
);


module.exports = router;
