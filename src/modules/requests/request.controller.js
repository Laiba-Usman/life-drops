const asyncHandler = require('../../utils/asyncHandler');
const ApiResponse = require('../../utils/ApiResponse');
const {
  createRequest,
  getAllRequests,
  getMyRequests,
  getRequestById,
  updateRequestStatus,
  deleteRequest,
} = require('./request.service');

// ─── POST /api/requests ───────────────────────────────────────────────────────
const create = asyncHandler(async (req, res) => {
  const request = await createRequest(req.user._id, req.body);
  res.status(201).json(new ApiResponse(201, request, 'Blood request created successfully'));
});

// ─── GET /api/requests  (Admin) ───────────────────────────────────────────────
const getAll = asyncHandler(async (req, res) => {
  const result = await getAllRequests(req.query);
  res.status(200).json(new ApiResponse(200, result, 'Requests fetched successfully'));
});

// ─── GET /api/requests/my ─────────────────────────────────────────────────────
const getMy = asyncHandler(async (req, res) => {
  const result = await getMyRequests(req.user._id, req.query);
  res.status(200).json(new ApiResponse(200, result, 'Your requests fetched successfully'));
});

// ─── GET /api/requests/:id ────────────────────────────────────────────────────
const getOne = asyncHandler(async (req, res) => {
  const request = await getRequestById(req.params.id);
  res.status(200).json(new ApiResponse(200, request, 'Request fetched successfully'));
});

// ─── PATCH /api/requests/:id/status  (Admin) ──────────────────────────────────
const updateStatus = asyncHandler(async (req, res) => {
  const request = await updateRequestStatus(req.params.id, req.body.status, req.user._id);
  res.status(200).json(new ApiResponse(200, request, `Request marked as ${req.body.status}`));
});

// ─── DELETE /api/requests/:id  (Admin) ───────────────────────────────────────
const remove = asyncHandler(async (req, res) => {
  await deleteRequest(req.params.id);
  res.status(200).json(new ApiResponse(200, null, 'Request deleted successfully'));
});

module.exports = { create, getAll, getMy, getOne, updateStatus, remove };
