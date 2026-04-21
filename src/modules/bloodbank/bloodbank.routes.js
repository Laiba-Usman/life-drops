const express = require('express');
const router = express.Router();

const { getStock, setStock, adjustStock } = require('./bloodbank.controller');
const { protect } = require('../../middleware/auth.middleware');
const { authorize } = require('../../middleware/role.middleware');
const { body, param } = require('express-validator');
const { BLOOD_GROUPS } = require('../../config/constants');
const validate = require('../../middleware/validate.middleware');

const bloodGroupParam = [
  param('bloodGroup')
    .isIn(BLOOD_GROUPS)
    .withMessage(`Blood group must be one of: ${BLOOD_GROUPS.join(', ')}`),
];

// Public
router.get('/inventory', getStock);

// Admin only
router.patch(
  '/inventory/:bloodGroup',
  protect,
  authorize('admin'),
  bloodGroupParam,
  [body('units').isFloat({ min: 0 }).withMessage('Units must be a non-negative number')],
  validate,
  setStock
);

router.patch(
  '/inventory/:bloodGroup/adjust',
  protect,
  authorize('admin'),
  bloodGroupParam,
  [body('delta').isNumeric().withMessage('Delta must be a number')],
  validate,
  adjustStock
);

module.exports = router;
