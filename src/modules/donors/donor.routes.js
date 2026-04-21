const express = require('express');
const router = express.Router();

const {
  register,
  getDonors,
  getMyDonorProfile,
  getDonor,
  updateDonorProfile,
  toggleMyAvailability,
  markDonation,
} = require('./donor.controller');

const { protect } = require('../../middleware/auth.middleware');
const { authorize } = require('../../middleware/role.middleware');
const {
  registerDonorValidator,
  updateDonorValidator,
  searchDonorValidator,
  mongoIdValidator,
} = require('./donor.validator');
const validate = require('../../middleware/validate.middleware');

// ─── Public routes (no auth needed) ──────────────────────────────────────────
router.get('/', searchDonorValidator, validate, getDonors);

// ─── Protected static routes — MUST come before /:id ─────────────────────────
// These use explicit paths so Express doesn't confuse them with /:id
router.post('/register', protect, registerDonorValidator, validate, register);
router.get('/my/profile', protect, getMyDonorProfile);
router.patch('/my/availability', protect, toggleMyAvailability);

// ─── Public dynamic route ─────────────────────────────────────────────────────
router.get('/:id', mongoIdValidator('id'), validate, getDonor);

// ─── Protected dynamic routes ─────────────────────────────────────────────────
router.patch('/:id', protect, mongoIdValidator('id'), updateDonorValidator, validate, updateDonorProfile);

// ─── Admin only ───────────────────────────────────────────────────────────────
router.patch('/:id/record-donation', protect, authorize('admin'), mongoIdValidator('id'), validate, markDonation);

module.exports = router;
