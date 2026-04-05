const express  = require('express');
const multer   = require('multer');
const router   = express.Router();
const { authenticate } = require('../middleware/auth');
const {
  registerLearner,
  listLearners,
  getLearner,
  updateLearner,
  deleteLearner,
  enrollLearner,
  getEnrollmentHistory,
  promoteLearner,
  transferLearner,
  getReportCard,
  bulkImportLearners,
} = require('../controllers/learner.controller');

// Memory storage — CSV is small enough, no need for disk
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },   // 5 MB max
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
      cb(null, true);
    } else {
      cb(new Error('Only CSV files are allowed'), false);
    }
  },
});

// All learner routes require authentication
router.use(authenticate);

// POST /bulk-import
router.post('/bulk-import', upload.single('file'), bulkImportLearners);

// POST /
router.post('/', registerLearner);

// GET /
router.get('/', listLearners);

// GET /:id
router.get('/:id', getLearner);

// PUT /:id
router.put('/:id', updateLearner);

// DELETE /:id
router.delete('/:id', deleteLearner);

// POST /:id/enroll
router.post('/:id/enroll', enrollLearner);

// GET /:id/enrollments
router.get('/:id/enrollments', getEnrollmentHistory);

// POST /:id/promote
router.post('/:id/promote', promoteLearner);

// POST /:id/transfer
router.post('/:id/transfer', transferLearner);

// GET /:id/report-card
router.get('/:id/report-card', getReportCard);

module.exports = router;
