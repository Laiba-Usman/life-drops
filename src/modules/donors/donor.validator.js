const { body, query, param } = require('express-validator');
const { BLOOD_GROUPS } = require('../../config/constants');

const registerDonorValidator = [
  body('bloodGroup')
    .notEmpty().withMessage('Blood group is required')
    .isIn(BLOOD_GROUPS).withMessage(`Blood group must be one of: ${BLOOD_GROUPS.join(', ')}`),

  body('city')
    .trim()
    .notEmpty().withMessage('City is required')
    .isLength({ max: 50 }).withMessage('City cannot exceed 50 characters'),

  body('age')
    .isInt({ min: 18, max: 65 }).withMessage('Age must be between 18 and 65'),

  body('weight')
    .optional()
    .isFloat({ min: 50 }).withMessage('Weight must be at least 50 kg'),

  body('medicalConditions')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Medical conditions text cannot exceed 500 characters'),
];

const updateDonorValidator = [
  body('bloodGroup')
    .optional()
    .isIn(BLOOD_GROUPS).withMessage(`Blood group must be one of: ${BLOOD_GROUPS.join(', ')}`),

  body('city')
    .optional()
    .trim()
    .isLength({ max: 50 }).withMessage('City cannot exceed 50 characters'),

  body('age')
    .optional()
    .isInt({ min: 18, max: 65 }).withMessage('Age must be between 18 and 65'),

  body('weight')
    .optional()
    .isFloat({ min: 50 }).withMessage('Weight must be at least 50 kg'),

  body('isAvailable')
    .optional()
    .isBoolean().withMessage('isAvailable must be true or false'),
];

const searchDonorValidator = [
  query('bloodGroup')
    .optional()
    .isIn(BLOOD_GROUPS).withMessage(`Invalid blood group`),

  query('city')
    .optional()
    .trim()
    .isLength({ max: 50 }),

  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('Page must be a positive integer'),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),
];

const mongoIdValidator = (field = 'id') => [
  param(field).isMongoId().withMessage(`Invalid ${field}`),
];

module.exports = {
  registerDonorValidator,
  updateDonorValidator,
  searchDonorValidator,
  mongoIdValidator,
};
