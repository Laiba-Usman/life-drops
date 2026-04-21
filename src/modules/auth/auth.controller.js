const asyncHandler = require('../../utils/asyncHandler');
const ApiResponse = require('../../utils/ApiResponse');
const { registerUser, loginUser } = require('./auth.service');

// ─── POST /api/auth/register ───────────────────────────────────────────────────
const register = asyncHandler(async (req, res) => {
  const { name, email, password, phone, city } = req.body;
  const result = await registerUser({ name, email, password, phone, city });

  res.status(201).json(
    new ApiResponse(201, result, 'Registration successful')
  );
});

// ─── POST /api/auth/login ──────────────────────────────────────────────────────
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const result = await loginUser({ email, password });

  res.status(200).json(
    new ApiResponse(200, result, 'Login successful')
  );
});

// ─── GET /api/auth/me ──────────────────────────────────────────────────────────
const getMe = asyncHandler(async (req, res) => {
  res.status(200).json(
    new ApiResponse(200, req.user, 'User profile fetched')
  );
});

// ─── POST /api/auth/logout ─────────────────────────────────────────────────────
const logout = asyncHandler(async (req, res) => {
  // JWT is stateless — client should discard the token.
  // For blacklisting, you'd store the token in Redis here.
  res.status(200).json(
    new ApiResponse(200, null, 'Logged out successfully')
  );
});

module.exports = { register, login, getMe, logout };
