const { verifyToken } = require('../utils/jwt.utils');
const ApiError = require('../utils/ApiError');
const User = require('../modules/users/user.model');
const asyncHandler = require('../utils/asyncHandler');

/**
 * Protects routes — verifies Bearer JWT and attaches req.user
 */
const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    throw new ApiError(401, 'Not authorized. No token provided.');
  }

  const decoded = verifyToken(token);

  const currentUser = await User.findById(decoded.id).select('-password');
  if (!currentUser) {
    throw new ApiError(401, 'The user belonging to this token no longer exists.');
  }

  req.user = currentUser;
  next();
});

module.exports = { protect };
