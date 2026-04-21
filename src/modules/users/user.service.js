const User = require('./user.model');
const ApiError = require('../../utils/ApiError');

const getAllUsers = async (query = {}) => {
  const { page = 1, limit = 10, city, role, search } = query;
  const filter = {};

  if (city) filter.city = { $regex: city, $options: 'i' };
  if (role) filter.role = role;
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const total = await User.countDocuments(filter);
  const users = await User.find(filter)
    .skip(skip)
    .limit(parseInt(limit))
    .sort({ createdAt: -1 });

  return {
    users,
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(total / parseInt(limit)),
    },
  };
};

const getUserById = async (id) => {
  const user = await User.findById(id);
  if (!user) throw new ApiError(404, 'User not found');
  return user;
};

const updateUser = async (id, updates, requesterId, requesterRole) => {
  if (requesterId.toString() !== id && requesterRole !== 'admin') {
    throw new ApiError(403, 'You can only update your own profile');
  }

  const user = await User.findByIdAndUpdate(id, updates, {
    new: true,
    runValidators: true,
  });
  if (!user) throw new ApiError(404, 'User not found');
  return user;
};

const deleteUser = async (id) => {
  const user = await User.findByIdAndDelete(id);
  if (!user) throw new ApiError(404, 'User not found');
  return user;
};

const changeUserRole = async (id, role) => {
  const user = await User.findByIdAndUpdate(
    id,
    { role },
    { new: true, runValidators: true }
  );
  if (!user) throw new ApiError(404, 'User not found');
  return user;
};

module.exports = { getAllUsers, getUserById, updateUser, deleteUser, changeUserRole };
