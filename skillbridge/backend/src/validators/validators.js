/**
 * Express Request Validators
 * Uses express-validator with fallback pure JavaScript validation rules.
 */

const { errorResponse } = require('../utils/response');

let expressValidator = null;
try {
  expressValidator = require('express-validator');
} catch (e) {
  // Pure JS fallback
}

// Validation runner middleware
const validateResult = (req, res, next) => {
  if (expressValidator && expressValidator.validationResult) {
    const errors = expressValidator.validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, 'Validation failed', 400, errors.array());
    }
  }
  next();
};

// Pure JS validation fallback helper
const validateFields = (rules) => {
  return (req, res, next) => {
    const errors = [];
    for (const rule of rules) {
      const val = req.body[rule.field];
      if (rule.required && (val === undefined || val === null || val === '')) {
        errors.push({ field: rule.field, message: `${rule.field} is required` });
        continue;
      }
      if (val !== undefined && val !== null && val !== '') {
        if (rule.isEmail && !/\S+@\S+\.\S+/.test(val)) {
          errors.push({ field: rule.field, message: `${rule.field} must be a valid email` });
        }
        if (rule.minLength && String(val).length < rule.minLength) {
          errors.push({ field: rule.field, message: `${rule.field} must be at least ${rule.minLength} characters` });
        }
        if (rule.isIn && !rule.isIn.includes(val)) {
          errors.push({ field: rule.field, message: `${rule.field} must be one of [${rule.isIn.join(', ')}]` });
        }
      }
    }
    if (errors.length > 0) {
      return errorResponse(res, 'Validation failed', 400, errors);
    }
    next();
  };
};

// Auth Validators
const registerValidator = expressValidator
  ? [
      expressValidator.body('email').isEmail().withMessage('Enter a valid email address').normalizeEmail(),
      expressValidator.body('username').trim().isLength({ min: 3, max: 30 }).withMessage('Username must be between 3 and 30 characters'),
      expressValidator.body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
      expressValidator.body('fullName').trim().notEmpty().withMessage('Full name is required'),
      validateResult
    ]
  : [
      validateFields([
        { field: 'email', required: true, isEmail: true },
        { field: 'username', required: true, minLength: 3 },
        { field: 'password', required: true, minLength: 6 },
        { field: 'fullName', required: true }
      ])
    ];

const loginValidator = expressValidator
  ? [
      expressValidator.body('email').trim().notEmpty().withMessage('Email or username is required'),
      expressValidator.body('password').notEmpty().withMessage('Password is required'),
      validateResult
    ]
  : [
      validateFields([
        { field: 'email', required: true },
        { field: 'password', required: true }
      ])
    ];

const exchangeRequestValidator = expressValidator
  ? [
      expressValidator.body('receiverId').notEmpty().withMessage('Receiver ID is required'),
      expressValidator.body('offeredSkillId').notEmpty().withMessage('Offered skill is required'),
      expressValidator.body('wantedSkillId').notEmpty().withMessage('Wanted skill is required'),
      expressValidator.body('message').trim().isLength({ min: 10 }).withMessage('Exchange message must be at least 10 characters'),
      validateResult
    ]
  : [
      validateFields([
        { field: 'receiverId', required: true },
        { field: 'offeredSkillId', required: true },
        { field: 'wantedSkillId', required: true },
        { field: 'message', required: true, minLength: 10 }
      ])
    ];

const sessionValidator = expressValidator
  ? [
      expressValidator.body('exchangeId').notEmpty().withMessage('Exchange ID is required'),
      expressValidator.body('title').trim().notEmpty().withMessage('Session title is required'),
      expressValidator.body('startTime').isISO8601().withMessage('Start time must be a valid ISO date'),
      expressValidator.body('duration').isInt({ min: 15, max: 240 }).withMessage('Duration must be between 15 and 240 minutes'),
      validateResult
    ]
  : [
      validateFields([
        { field: 'exchangeId', required: true },
        { field: 'title', required: true },
        { field: 'startTime', required: true }
      ])
    ];

const reviewValidator = expressValidator
  ? [
      expressValidator.body('exchangeId').notEmpty().withMessage('Exchange ID is required'),
      expressValidator.body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5 stars'),
      expressValidator.body('comment').trim().isLength({ min: 5 }).withMessage('Review comment must be at least 5 characters'),
      validateResult
    ]
  : [
      validateFields([
        { field: 'exchangeId', required: true },
        { field: 'rating', required: true },
        { field: 'comment', required: true, minLength: 5 }
      ])
    ];

module.exports = {
  validateResult,
  registerValidator,
  loginValidator,
  exchangeRequestValidator,
  sessionValidator,
  reviewValidator
};
