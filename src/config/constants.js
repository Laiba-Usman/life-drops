const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const ROLES = {
  USER: 'user',
  DONOR: 'donor',
  ADMIN: 'admin',
};

const REQUEST_STATUS = {
  PENDING: 'pending',
  FULFILLED: 'fulfilled',
  CANCELLED: 'cancelled',
};

const URGENCY_LEVELS = {
  NORMAL: 'normal',
  URGENT: 'urgent',
  CRITICAL: 'critical',
};

const NOTIFICATION_TYPES = {
  REQUEST_CREATED: 'request_created',
  REQUEST_FULFILLED: 'request_fulfilled',
  REQUEST_CANCELLED: 'request_cancelled',
  DONOR_MATCH: 'donor_match',
  GENERAL: 'general',
};

module.exports = {
  BLOOD_GROUPS,
  ROLES,
  REQUEST_STATUS,
  URGENCY_LEVELS,
  NOTIFICATION_TYPES,
};
