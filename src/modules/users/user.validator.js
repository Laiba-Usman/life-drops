const { body, param } = require('express-validator');

const updateUserValidator = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 }).withMessage('Name must be 2–50 characters'),

  body('phone')
    .optional()
    .isMobilePhone().withMessage('Please provide a valid phone number'),

  body('city')
    .optional()
    .trim()
    .isLength({ max: 50 }).withMessage('City cannot exceed 50 characters'),

  body('email')
    .not().exists().withMessage('Email cannot be updated via this endpoint'),

  body('password')
    .not().exists().withMessage('Use /change-password to update password'),

  body('role')
    .not().exists().withMessage('Role cannot be updated via this endpoint'),
];

const mongoIdValidator = (field = 'id') => [
  param(field).isMongoId().withMessage(`Invalid ${field}`),
];

module.exports = { updateUserValidator, mongoIdValidator };
