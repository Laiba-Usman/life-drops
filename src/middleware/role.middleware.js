const ApiError = require('../utils/ApiError');

/**
 * Authorization middleware — restricts access to specified roles.
 * Must be used AFTER protect middleware (req.user must be set).
 *
 * Usage: authorize('admin')  or  authorize('admin', 'donor')
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      throw new ApiError(401, 'Not authenticated.');
    }
    if (!roles.includes(req.user.role)) {
      throw new ApiError(
        403,
        `Access denied. Role '${req.user.role}' is not permitted for this action.`
      );
    }
    next();
  };
};

module.exports = { authorize };
