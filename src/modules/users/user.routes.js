const express = require('express');
const router = express.Router();

const {
  getUsers,
  getUser,
  updateUserProfile,
  deleteUserById,
  updateUserRole,
} = require('./user.controller');

const { protect } = require('../../middleware/auth.middleware');
const { authorize } = require('../../middleware/role.middleware');
const { updateUserValidator, mongoIdValidator } = require('./user.validator');
const validate = require('../../middleware/validate.middleware');
const { body } = require('express-validator');

// All routes require authentication
router.use(protect);

// Admin: get all users
router.get('/', authorize('admin'), getUsers);

// Admin: change user role  — static path before /:id
router.patch(
  '/:id/role',
  authorize('admin'),
  mongoIdValidator('id'),
  [body('role').isIn(['user', 'donor', 'admin']).withMessage('Invalid role')],
  validate,
  updateUserRole
);

// Admin: delete user
router.delete('/:id', authorize('admin'), mongoIdValidator('id'), validate, deleteUserById);

// Admin or Self: get a single user
router.get('/:id', mongoIdValidator('id'), validate, getUser);

// Self: update own profile
router.patch('/:id', mongoIdValidator('id'), updateUserValidator, validate, updateUserProfile);

module.exports = router;
