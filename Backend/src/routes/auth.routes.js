const express = require('express');
const rateLimit = require('express-rate-limit');
const { body } = require('express-validator');
const authController = require('../controllers/auth.controller');
const registerController = require('../controllers/register.controller');
const { authenticate, auditLog, securityHeaders } = require('../middleware/auth');

const router = express.Router();

// =====================================================
// DEBUGGING - REMOVE AFTER FIXING
// =====================================================
console.log('🔥 auth.routes.js is being loaded!');

// Test route to verify router is mounted
router.get('/test', (req, res) => {
  console.log('✅ Test route hit at:', new Date().toISOString());
  res.json({ 
    success: true, 
    message: 'Auth router is working correctly',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    routes: {
      test: 'GET /api/auth/test',
      login: 'POST /api/auth/login',
      register: 'POST /api/auth/register-school-admin',
      refresh: 'POST /api/auth/refresh-token',
      logout: 'POST /api/auth/logout'
    }
  });
});

// Simple login test route (bypasses controllers for debugging)
router.post('/test-login', (req, res) => {
  console.log('🔧 Test login endpoint hit:', {
    body: req.body,
    headers: req.headers['content-type'],
    timestamp: new Date().toISOString()
  });
  
  res.json({
    success: true,
    message: 'Test login endpoint working',
    receivedData: req.body,
    note: 'This is a test endpoint. Use /login for actual authentication.'
  });
});

/* =====================================================
   GLOBAL SECURITY
===================================================== */

// Apply security headers to all auth routes
router.use(securityHeaders);

// Rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per window
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/* =====================================================
   PUBLIC ROUTES
===================================================== */

// ✅ Register School Admin (Bootstrap Endpoint)
router.post(
  '/register-school-admin',
  authLimiter,
  [
    body('administratorEmail')
      .isEmail()
      .withMessage('Please provide a valid administrator email'),

    body('administratorPassword')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters long'),

    body('schoolName')
      .notEmpty()
      .withMessage('School name is required'),

    body('schoolCode')
      .notEmpty()
      .withMessage('School code is required'),
  ],
  (req, res, next) => {
    console.log('📝 Register school admin endpoint hit:', {
      body: req.body,
      timestamp: new Date().toISOString()
    });
    next();
  },
  auditLog('REGISTER_SCHOOL_ADMIN'),
  registerController.registerSchoolAdmin
);

// ✅ Login (Enhanced with debugging)
router.post(
  '/login',
  authLimiter,
  [
    body('email')
      .isEmail()
      .withMessage('Please provide a valid email address'),

    body('password')
      .notEmpty()
      .withMessage('Password is required'),
  ],
  (req, res, next) => {
    console.log('🔐 Login endpoint hit:', {
      email: req.body.email,
      hasPassword: !!req.body.password,
      contentType: req.headers['content-type'],
      timestamp: new Date().toISOString()
    });
    next();
  },
  auditLog('USER_LOGIN'),
  async (req, res, next) => {
    try {
      // Check if controller exists
      if (!authController || typeof authController.login !== 'function') {
        console.error('❌ authController.login is not a function!', {
          authController: !!authController,
          loginFunction: authController ? typeof authController.login : 'undefined'
        });
        return res.status(500).json({
          success: false,
          message: 'Server configuration error: Auth controller not properly loaded'
        });
      }
      
      // Call the actual controller
      await authController.login(req, res, next);
    } catch (error) {
      console.error('❌ Error in login route:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      
      res.status(500).json({
        success: false,
        message: process.env.NODE_ENV === 'development' 
          ? `Login error: ${error.message}`
          : 'An error occurred during login. Please try again.'
      });
    }
  }
);

// ✅ Refresh Token
router.post(
  '/refresh-token',
  authLimiter,
  [
    body('refreshToken')
      .notEmpty()
      .withMessage('Refresh token is required'),
  ],
  (req, res, next) => {
    console.log('🔄 Refresh token endpoint hit:', {
      hasRefreshToken: !!req.body.refreshToken,
      timestamp: new Date().toISOString()
    });
    next();
  },
  auditLog('REFRESH_TOKEN'),
  authController.refreshToken
);

/* =====================================================
   PROTECTED ROUTES
===================================================== */

// ✅ Logout
router.post(
  '/logout',
  (req, res, next) => {
    console.log('🚪 Logout endpoint hit:', {
      hasAuthHeader: !!req.headers.authorization,
      timestamp: new Date().toISOString()
    });
    next();
  },
  authenticate,
  auditLog('USER_LOGOUT'),
  authController.logout
);

// Catch-all route to check what endpoints are registered
router.all('*', (req, res) => {
  console.log('❓ Unmatched auth route:', {
    method: req.method,
    path: req.path,
    originalUrl: req.originalUrl,
    timestamp: new Date().toISOString()
  });
  
  res.status(404).json({
    success: false,
    message: `Auth endpoint '${req.method} ${req.path}' not found`,
    availableEndpoints: [
      'GET /api/auth/test',
      'POST /api/auth/test-login',
      'POST /api/auth/login',
      'POST /api/auth/register-school-admin',
      'POST /api/auth/refresh-token',
      'POST /api/auth/logout'
    ]
  });
});

console.log('✅ Auth routes registered:', {
  routes: [
    'GET /test',
    'POST /test-login',
    'POST /login',
    'POST /register-school-admin',
    'POST /refresh-token',
    'POST /logout'
  ],
  timestamp: new Date().toISOString()
});

module.exports = router;