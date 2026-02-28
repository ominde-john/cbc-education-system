// ================================================================
// validators/school.validator.js
// Validates all incoming school registration payloads before
// they reach the controller. Uses Joi for schema validation.
//
// Install: npm install joi
// ================================================================

const Joi = require('joi');

// ----------------------------------------------------------------
// Reusable field definitions
// ----------------------------------------------------------------

const kenyanPhone = Joi.string()
  .pattern(/^\+?[0-9]{10,15}$/)
  .message('Phone number must be 10–15 digits, optionally starting with +');

const strongPassword = Joi.string()
  .min(8)
  .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/)
  .message(
    'Password must be at least 8 characters and include uppercase, ' +
    'lowercase, a number, and a special character'
  );

// ----------------------------------------------------------------
// School Admin Registration Schema
// Maps exactly to your form fields
// ----------------------------------------------------------------

const schoolAdminRegistrationSchema = Joi.object({

  // ── School fields ──────────────────────────────────────────
  school_name: Joi.string()
    .min(3)
    .max(100)
    .required()
    .messages({
      'string.min': 'School name must be at least 3 characters',
      'any.required': 'School name is required',
    }),

  school_code: Joi.string()
    .uppercase()
    .pattern(/^[A-Z0-9]{3,20}$/)
    .required()
    .messages({
      'string.pattern.base': 'School code must be 3–20 uppercase letters/numbers only',
      'any.required': 'School code is required',
    }),

  school_type: Joi.string()
    .valid('public', 'private')
    .required()
    .messages({
      'any.only': 'School type must be either public or private',
      'any.required': 'School type is required',
    }),

  // Maps to schools.level CHECK constraint values
  level: Joi.string()
    .valid('ecde', 'primary', 'junior_secondary', 'senior_secondary')
    .required()
    .messages({
      'any.only': 'Level must be one of: ecde, primary, junior_secondary, senior_secondary',
      'any.required': 'School level is required',
    }),

  phone_number: kenyanPhone.required(),

  county: Joi.string().min(2).max(50).required(),
  sub_county: Joi.string().min(2).max(50).required(),
  ward: Joi.string().min(2).max(50).optional().allow('', null),

  // New columns added in frontend_gap_fix.sql
  year_established: Joi.number()
    .integer()
    .min(1800)
    .max(new Date().getFullYear())
    .optional()
    .allow(null)
    .messages({
      'number.min': 'Year established cannot be before 1800',
      'number.max': `Year established cannot be in the future`,
    }),

  student_capacity: Joi.number()
    .integer()
    .min(1)
    .max(100000)
    .optional()
    .allow(null)
    .messages({
      'number.min': 'Student capacity must be at least 1',
    }),

  // Optional school details
  physical_address: Joi.string().max(255).optional().allow('', null),
  postal_address: Joi.string().max(100).optional().allow('', null),
  website: Joi.string().uri().optional().allow('', null),

  // ── Admin (user) fields ────────────────────────────────────
  admin_name: Joi.string()
    .min(2)
    .max(100)
    .required()
    .messages({
      'any.required': 'Admin name is required',
      'string.min': 'Admin name must be at least 2 characters',
    }),

  admin_email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Admin email is required',
    }),

  password: strongPassword.required(),

  confirm_password: Joi.string()
    .valid(Joi.ref('password'))
    .required()
    .messages({
      'any.only': 'Passwords do not match',
      'any.required': 'Please confirm your password',
    }),

  // ── TSC (optional during registration) ────────────────────
  tsc_number: Joi.string()
    .pattern(/^[A-Z0-9]{6,10}$/)
    .optional()
    .allow('', null)
    .messages({
      'string.pattern.base': 'TSC number must be 6–10 uppercase letters/numbers',
    }),

  appointment_date: Joi.date().optional().allow(null),

}).options({ abortEarly: false }); // return ALL errors at once, not just the first


// ----------------------------------------------------------------
// Teacher / Parent Registration Schema (second tab)
// ----------------------------------------------------------------

const teacherRegistrationSchema = Joi.object({
  school_code: Joi.string().uppercase().required(),

  first_name: Joi.string().min(2).max(50).required(),
  last_name:  Joi.string().min(2).max(50).required(),
  email:      Joi.string().email({ tlds: { allow: false } }).required(),
  phone_number: kenyanPhone.optional().allow('', null),
  password:   strongPassword.required(),
  confirm_password: Joi.string().valid(Joi.ref('password')).required()
    .messages({ 'any.only': 'Passwords do not match' }),

  tsc_number: Joi.string()
    .pattern(/^[A-Z0-9]{6,10}$/)
    .required()
    .messages({
      'string.pattern.base': 'TSC number must be 6–10 uppercase letters/numbers',
      'any.required': 'TSC number is required for teachers',
    }),

  qualifications: Joi.string().max(500).optional().allow('', null),
  date_joined: Joi.date().optional().default(() => new Date()),

}).options({ abortEarly: false });


const parentRegistrationSchema = Joi.object({
  school_code: Joi.string().uppercase().required(),

  first_name:  Joi.string().min(2).max(50).required(),
  last_name:   Joi.string().min(2).max(50).required(),
  email:       Joi.string().email({ tlds: { allow: false } }).required(),
  phone_number: kenyanPhone.optional().allow('', null),
  password:    strongPassword.required(),
  confirm_password: Joi.string().valid(Joi.ref('password')).required()
    .messages({ 'any.only': 'Passwords do not match' }),

  relationship: Joi.string()
    .valid('father', 'mother', 'guardian')
    .required()
    .messages({ 'any.only': 'Relationship must be father, mother, or guardian' }),

  national_id: Joi.string()
    .pattern(/^[0-9]{7,8}$/)
    .optional()
    .allow('', null)
    .messages({ 'string.pattern.base': 'National ID must be 7–8 digits' }),

  occupation: Joi.string().max(100).optional().allow('', null),
  date_of_birth: Joi.date().optional().allow(null),

}).options({ abortEarly: false });


// ----------------------------------------------------------------
// Middleware factory — wraps any Joi schema into Express middleware
// ----------------------------------------------------------------

const validate = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body);

  if (error) {
    const errors = error.details.map((d) => ({
      field:   d.path.join('.'),
      message: d.message.replace(/['"]/g, ''),
    }));

    return res.status(422).json({
      success: false,
      message: 'Validation failed',
      errors,
    });
  }

  // Replace req.body with the cleaned/coerced Joi output
  req.body = value;
  next();
};


module.exports = {
  validateSchoolAdminRegistration: validate(schoolAdminRegistrationSchema),
  validateTeacherRegistration:     validate(teacherRegistrationSchema),
  validateParentRegistration:      validate(parentRegistrationSchema),

  // Export raw schemas for unit testing
  schoolAdminRegistrationSchema,
  teacherRegistrationSchema,
  parentRegistrationSchema,
};
