const BloodRequest = require('./request.model');
const ApiError = require('../../utils/ApiError');

const createRequest = async (requesterId, data) => {
  const request = await BloodRequest.create({ requester: requesterId, ...data });
  return await request.populate('requester', 'name email phone city');
};

const getAllRequests = async (query = {}) => {
  const { bloodGroup, city, status, urgency, page = 1, limit = 10 } = query;
  const filter = {};

  if (bloodGroup) filter.bloodGroup = bloodGroup;
  if (city) filter.city = { $regex: city, $options: 'i' };
  if (status) filter.status = status;
  if (urgency) filter.urgency = urgency;

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const total = await BloodRequest.countDocuments(filter);
  const requests = await BloodRequest.find(filter)
    .populate('requester', 'name email phone')
    .skip(skip)
    .limit(parseInt(limit))
    .sort({ urgency: -1, createdAt: -1 });

  return {
    requests,
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(total / parseInt(limit)),
    },
  };
};

const getMyRequests = async (userId, query = {}) => {
  const { status, page = 1, limit = 10 } = query;
  const filter = { requester: userId };
  if (status) filter.status = status;

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const total = await BloodRequest.countDocuments(filter);
  const requests = await BloodRequest.find(filter)
    .skip(skip)
    .limit(parseInt(limit))
    .sort({ createdAt: -1 });

  return {
    requests,
    pagination: { total, page: parseInt(page), limit: parseInt(limit), pages: Math.ceil(total / parseInt(limit)) },
  };
};

const getRequestById = async (id) => {
  const request = await BloodRequest.findById(id).populate('requester', 'name email phone city');
  if (!request) throw new ApiError(404, 'Blood request not found');
  return request;
};

const updateRequestStatus = async (id, status, adminId) => {
  const request = await BloodRequest.findById(id);
  if (!request) throw new ApiError(404, 'Blood request not found');

  request.status = status;
  if (status === 'fulfilled') request.fulfilledAt = new Date();
  await request.save();

  return request;
};

const deleteRequest = async (id) => {
  const request = await BloodRequest.findById(id);
  if (!request) throw new ApiError(404, 'Blood request not found');
  if (request.status === 'fulfilled') {
    throw new ApiError(400, 'Cannot delete a fulfilled request');
  }
  await request.deleteOne();
  return request;
};

module.exports = {
  createRequest,
  getAllRequests,
  getMyRequests,
  getRequestById,
  updateRequestStatus,
  deleteRequest,
};
