const express = require('express');
const rateLimit = require('express-rate-limit');
const { body } = require('express-validator');
const authController = require('../controllers/auth.controller');
const { authenticate, auditLog, securityHeaders } = require('../middleware/auth');

const router = express.Router();

// Apply security headers to all auth routes
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

// Login endpoint
router.post('/login',
  authLimiter,
  [
    body('email').isEmail().withMessage('Please provide a valid email address'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  auditLog('USER_LOGIN'),
  authController.login
);

// Logout endpoint
router.post('/logout',
  authenticate,
  auditLog('USER_LOGOUT'),
  authController.logout
);

// Refresh token endpoint
router.post('/refresh-token',
  [
    body('refreshToken').notEmpty().withMessage('Refresh token is required'),
  ],
  auditLog('TOKEN_REFRESH'),
  authController.refreshToken
);

module.exports = router;
