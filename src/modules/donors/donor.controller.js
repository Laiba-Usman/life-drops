const asyncHandler = require('../../utils/asyncHandler');
const ApiResponse = require('../../utils/ApiResponse');
const {
  registerDonor,
  getAllDonors,
  getDonorById,
  getDonorByUserId,
  updateDonor,
  toggleAvailability,
  recordDonation,
} = require('./donor.service');

// ─── POST /api/donors/register ────────────────────────────────────────────────
const register = asyncHandler(async (req, res) => {
  const donor = await registerDonor(req.user._id, req.body);
  res.status(201).json(new ApiResponse(201, donor, 'Donor registered successfully'));
});

// ─── GET /api/donors ──────────────────────────────────────────────────────────
const getDonors = asyncHandler(async (req, res) => {
  const result = await getAllDonors(req.query);
  res.status(200).json(new ApiResponse(200, result, 'Donors fetched successfully'));
});

// ─── GET /api/donors/my ───────────────────────────────────────────────────────
const getMyDonorProfile = asyncHandler(async (req, res) => {
  const donor = await getDonorByUserId(req.user._id);
  res.status(200).json(new ApiResponse(200, donor, 'Your donor profile'));
});

// ─── GET /api/donors/:id ──────────────────────────────────────────────────────
const getDonor = asyncHandler(async (req, res) => {
  const donor = await getDonorById(req.params.id);
  res.status(200).json(new ApiResponse(200, donor, 'Donor fetched successfully'));
});

// ─── PATCH /api/donors/:id ────────────────────────────────────────────────────
const updateDonorProfile = asyncHandler(async (req, res) => {
  const donor = await updateDonor(req.params.id, req.body, req.user._id, req.user.role);
  res.status(200).json(new ApiResponse(200, donor, 'Donor profile updated successfully'));
});

// ─── PATCH /api/donors/availability ──────────────────────────────────────────
const toggleMyAvailability = asyncHandler(async (req, res) => {
  const donor = await toggleAvailability(req.user._id);
  res.status(200).json(
    new ApiResponse(200, donor, `Availability set to ${donor.isAvailable}`)
  );
});

// ─── PATCH /api/donors/:id/record-donation (Admin) ───────────────────────────
const markDonation = asyncHandler(async (req, res) => {
  const donor = await recordDonation(req.params.id);
  res.status(200).json(new ApiResponse(200, donor, 'Donation recorded successfully'));
});

module.exports = {
  register,
  getDonors,
  getMyDonorProfile,
  getDonor,
  updateDonorProfile,
  toggleMyAvailability,
  markDonation,
};
