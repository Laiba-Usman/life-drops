const { body, query, param } = require('express-validator');
const { BLOOD_GROUPS, REQUEST_STATUS, URGENCY_LEVELS } = require('../../config/constants');

const createRequestValidator = [
  body('bloodGroup')
    .notEmpty().withMessage('Blood group is required')
    .isIn(BLOOD_GROUPS).withMessage(`Blood group must be one of: ${BLOOD_GROUPS.join(', ')}`),

  body('units')
    .isInt({ min: 1, max: 10 }).withMessage('Units must be between 1 and 10'),

  body('hospital')
    .trim()
    .notEmpty().withMessage('Hospital name is required')
    .isLength({ max: 100 }).withMessage('Hospital name cannot exceed 100 characters'),

  body('city')
    .trim()
    .notEmpty().withMessage('City is required'),

  body('urgency')
    .optional()
    .isIn(Object.values(URGENCY_LEVELS))
    .withMessage('Urgency must be normal, urgent, or critical'),

  body('patientName')
    .optional()
    .trim()
    .isLength({ max: 50 }).withMessage('Patient name cannot exceed 50 characters'),

  body('contactPhone')
    .optional()
    .isMobilePhone().withMessage('Invalid contact phone number'),

  body('notes')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Notes cannot exceed 500 characters'),
];

const updateStatusValidator = [
  body('status')
    .notEmpty().withMessage('Status is required')
    .isIn(Object.values(REQUEST_STATUS))
    .withMessage(`Status must be one of: ${Object.values(REQUEST_STATUS).join(', ')}`),
];

const listRequestsValidator = [
  query('bloodGroup').optional().isIn(BLOOD_GROUPS),
  query('city').optional().trim(),
  query('status').optional().isIn(Object.values(REQUEST_STATUS)),
  query('urgency').optional().isIn(Object.values(URGENCY_LEVELS)),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 50 }),
];

const mongoIdValidator = (field = 'id') => [
  param(field).isMongoId().withMessage(`Invalid ${field}`),
];

module.exports = {
  createRequestValidator,
  updateStatusValidator,
  listRequestsValidator,
  mongoIdValidator,
};
