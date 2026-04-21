const express = require('express');
const router = express.Router();

const {
  getMyNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  sendNotification,
} = require('./notification.controller');

const { protect } = require('../../middleware/auth.middleware');
const { authorize } = require('../../middleware/role.middleware');
const { body, param } = require('express-validator');
const { NOTIFICATION_TYPES } = require('../../config/constants');
const validate = require('../../middleware/validate.middleware');

router.use(protect);

router.get('/my', getMyNotifications);
router.patch('/read-all', markAllAsRead);
router.patch(
  '/:id/read',
  [param('id').isMongoId().withMessage('Invalid notification id')],
  validate,
  markAsRead
);
router.delete(
  '/:id',
  [param('id').isMongoId().withMessage('Invalid notification id')],
  validate,
  deleteNotification
);

// Admin: send a notification manually
router.post(
  '/',
  authorize('admin'),
  [
    body('recipientId').isMongoId().withMessage('Invalid recipient ID'),
    body('type').isIn(Object.values(NOTIFICATION_TYPES)).withMessage('Invalid notification type'),
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('message').trim().notEmpty().withMessage('Message is required'),
    body('relatedRequest').optional().isMongoId(),
  ],
  validate,
  sendNotification
);

module.exports = router;
