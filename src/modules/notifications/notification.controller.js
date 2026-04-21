const asyncHandler = require('../../utils/asyncHandler');
const ApiResponse = require('../../utils/ApiResponse');
const ApiError = require('../../utils/ApiError');
const Notification = require('./notification.model');

// ─── GET /api/notifications/my ────────────────────────────────────────────────
const getMyNotifications = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, isRead } = req.query;
  const filter = { recipient: req.user._id };

  if (isRead !== undefined) filter.isRead = isRead === 'true';

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const total = await Notification.countDocuments(filter);
  const notifications = await Notification.find(filter)
    .skip(skip)
    .limit(parseInt(limit))
    .sort({ createdAt: -1 });

  const unreadCount = await Notification.countDocuments({ recipient: req.user._id, isRead: false });

  res.status(200).json(
    new ApiResponse(200, { notifications, unreadCount, pagination: { total, page: parseInt(page), limit: parseInt(limit), pages: Math.ceil(total / parseInt(limit)) } }, 'Notifications fetched')
  );
});

// ─── PATCH /api/notifications/:id/read ───────────────────────────────────────
const markAsRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: req.params.id, recipient: req.user._id },
    { isRead: true },
    { new: true }
  );
  if (!notification) throw new ApiError(404, 'Notification not found');

  res.status(200).json(new ApiResponse(200, notification, 'Notification marked as read'));
});

// ─── PATCH /api/notifications/read-all ───────────────────────────────────────
const markAllAsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany({ recipient: req.user._id, isRead: false }, { isRead: true });
  res.status(200).json(new ApiResponse(200, null, 'All notifications marked as read'));
});

// ─── DELETE /api/notifications/:id ───────────────────────────────────────────
const deleteNotification = asyncHandler(async (req, res) => {
  const notification = await Notification.findOneAndDelete({
    _id: req.params.id,
    recipient: req.user._id,
  });
  if (!notification) throw new ApiError(404, 'Notification not found');
  res.status(200).json(new ApiResponse(200, null, 'Notification deleted'));
});

// ─── POST /api/notifications  (Admin: send notification to user) ──────────────
const sendNotification = asyncHandler(async (req, res) => {
  const { recipientId, type, title, message, relatedRequest } = req.body;
  const notification = await Notification.create({
    recipient: recipientId,
    type,
    title,
    message,
    relatedRequest,
  });
  res.status(201).json(new ApiResponse(201, notification, 'Notification sent'));
});

module.exports = { getMyNotifications, markAsRead, markAllAsRead, deleteNotification, sendNotification };
