const express = require('express');
const rateLimit = require('express-rate-limit');
const { body } = require('express-validator');
const authController = require('../controllers/auth.controller');
const { authenticate, authorize, rateLimit: customRateLimit, auditLog, securityHeaders } = require('../middleware/auth');

const router = express.Router();

// Apply security headers to all user routes
router.use(securityHeaders);

// Rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Login endpoint - matches the working /api/users/login
router.post('/login',
  authLimiter,
  [
    body('email').isEmail().withMessage('Please provide a valid email address'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  auditLog('USER_LOGIN'),
  authController.login
);

module.exports = router;
