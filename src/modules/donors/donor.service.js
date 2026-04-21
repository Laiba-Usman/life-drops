const Donor = require('./donor.model');
const User = require('../users/user.model');
const ApiError = require('../../utils/ApiError');

const registerDonor = async (userId, donorData) => {
  // Check if already registered as donor
  const existing = await Donor.findOne({ user: userId });
  if (existing) throw new ApiError(409, 'You are already registered as a donor');

  const donor = await Donor.create({ user: userId, ...donorData });

  // Update user role to donor
  await User.findByIdAndUpdate(userId, { role: 'donor' });

  return await donor.populate('user', 'name email phone city');
};

const getAllDonors = async (query = {}) => {
  const { bloodGroup, city, isAvailable, page = 1, limit = 10 } = query;
  const filter = {};

  if (bloodGroup) filter.bloodGroup = bloodGroup;
  if (city) filter.city = { $regex: city, $options: 'i' };
  if (isAvailable !== undefined) filter.isAvailable = isAvailable === 'true';

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const total = await Donor.countDocuments(filter);
  const donors = await Donor.find(filter)
    .populate('user', 'name email phone city')
    .skip(skip)
    .limit(parseInt(limit))
    .sort({ totalDonations: -1, createdAt: -1 });

  return {
    donors,
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(total / parseInt(limit)),
    },
  };
};

const getDonorById = async (id) => {
  const donor = await Donor.findById(id).populate('user', 'name email phone city');
  if (!donor) throw new ApiError(404, 'Donor not found');
  return donor;
};

const getDonorByUserId = async (userId) => {
  const donor = await Donor.findOne({ user: userId }).populate('user', 'name email phone city');
  if (!donor) throw new ApiError(404, 'Donor profile not found for this user');
  return donor;
};

const updateDonor = async (id, updates, requesterId, requesterRole) => {
  const donor = await Donor.findById(id);
  if (!donor) throw new ApiError(404, 'Donor not found');

  if (donor.user.toString() !== requesterId.toString() && requesterRole !== 'admin') {
    throw new ApiError(403, 'You can only update your own donor profile');
  }

  const updated = await Donor.findByIdAndUpdate(id, updates, {
    new: true,
    runValidators: true,
  }).populate('user', 'name email phone city');

  return updated;
};

const toggleAvailability = async (userId) => {
  const donor = await Donor.findOne({ user: userId });
  if (!donor) throw new ApiError(404, 'Donor profile not found');

  donor.isAvailable = !donor.isAvailable;
  await donor.save();
  return donor;
};

const recordDonation = async (donorId) => {
  const donor = await Donor.findByIdAndUpdate(
    donorId,
    {
      lastDonated: new Date(),
      $inc: { totalDonations: 1 },
      isAvailable: false,
    },
    { new: true }
  );
  if (!donor) throw new ApiError(404, 'Donor not found');
  return donor;
};

module.exports = {
  registerDonor,
  getAllDonors,
  getDonorById,
  getDonorByUserId,
  updateDonor,
  toggleAvailability,
  recordDonation,
};
