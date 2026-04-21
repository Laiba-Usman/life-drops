const express = require('express');
const router = express.Router();

const { create, getAll, getMy, getOne, updateStatus, remove } = require('./request.controller');
const { protect } = require('../../middleware/auth.middleware');
const { authorize } = require('../../middleware/role.middleware');
const {
  createRequestValidator,
  updateStatusValidator,
  listRequestsValidator,
  mongoIdValidator,
} = require('./request.validator');
const validate = require('../../middleware/validate.middleware');

// ─── All routes require login ─────────────────────────────────────────────────

// Static paths first — MUST be before /:id routes
router.post('/',    protect, createRequestValidator, validate, create);
router.get('/my',   protect, getMy);

// Admin: get ALL requests — static path, declare before /:id
router.get('/',     protect, authorize('admin'), listRequestsValidator, validate, getAll);

// Dynamic :id routes
router.get('/:id',          protect, mongoIdValidator('id'), validate, getOne);
router.patch('/:id/status', protect, authorize('admin'), mongoIdValidator('id'), updateStatusValidator, validate, updateStatus);
router.delete('/:id',       protect, authorize('admin'), mongoIdValidator('id'), validate, remove);

module.exports = router;
