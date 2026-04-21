const asyncHandler = require('../../utils/asyncHandler');
const ApiResponse = require('../../utils/ApiResponse');
const {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  changeUserRole,
} = require('./user.service');

// ─── GET /api/users  (Admin only) ─────────────────────────────────────────────
const getUsers = asyncHandler(async (req, res) => {
  const result = await getAllUsers(req.query);
  res.status(200).json(new ApiResponse(200, result, 'Users fetched successfully'));
});

// ─── GET /api/users/:id  (Admin or Self) ──────────────────────────────────────
const getUser = asyncHandler(async (req, res) => {
  const user = await getUserById(req.params.id);
  res.status(200).json(new ApiResponse(200, user, 'User fetched successfully'));
});

// ─── PATCH /api/users/:id  (Self only) ────────────────────────────────────────
const updateUserProfile = asyncHandler(async (req, res) => {
  const allowed = ['name', 'phone', 'city'];
  const updates = {};
  allowed.forEach((key) => {
    if (req.body[key] !== undefined) updates[key] = req.body[key];
  });

  const user = await updateUser(req.params.id, updates, req.user._id, req.user.role);
  res.status(200).json(new ApiResponse(200, user, 'Profile updated successfully'));
});

// ─── DELETE /api/users/:id  (Admin only) ──────────────────────────────────────
const deleteUserById = asyncHandler(async (req, res) => {
  await deleteUser(req.params.id);
  res.status(200).json(new ApiResponse(200, null, 'User deleted successfully'));
});

// ─── PATCH /api/users/:id/role  (Admin only) ──────────────────────────────────
const updateUserRole = asyncHandler(async (req, res) => {
  const user = await changeUserRole(req.params.id, req.body.role);
  res.status(200).json(new ApiResponse(200, user, 'User role updated successfully'));
});

module.exports = { getUsers, getUser, updateUserProfile, deleteUserById, updateUserRole };
