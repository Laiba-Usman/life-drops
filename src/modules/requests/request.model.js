const mongoose = require('mongoose');
const { BLOOD_GROUPS, REQUEST_STATUS, URGENCY_LEVELS } = require('../../config/constants');

const bloodRequestSchema = new mongoose.Schema(
  {
    requester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Requester is required'],
    },
    bloodGroup: {
      type: String,
      required: [true, 'Blood group is required'],
      enum: {
        values: BLOOD_GROUPS,
        message: 'Invalid blood group',
      },
    },
    units: {
      type: Number,
      required: [true, 'Number of units is required'],
      min: [1, 'At least 1 unit required'],
      max: [10, 'Cannot request more than 10 units at once'],
    },
    hospital: {
      type: String,
      required: [true, 'Hospital name is required'],
      trim: true,
      maxlength: [100, 'Hospital name cannot exceed 100 characters'],
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
    },
    urgency: {
      type: String,
      enum: {
        values: Object.values(URGENCY_LEVELS),
        message: 'Urgency must be normal, urgent, or critical',
      },
      default: URGENCY_LEVELS.NORMAL,
    },
    status: {
      type: String,
      enum: {
        values: Object.values(REQUEST_STATUS),
        message: 'Invalid status',
      },
      default: REQUEST_STATUS.PENDING,
    },
    patientName: {
      type: String,
      trim: true,
      maxlength: [50, 'Patient name cannot exceed 50 characters'],
    },
    contactPhone: {
      type: String,
      match: [/^\+?[0-9]{10,15}$/, 'Please provide a valid phone number'],
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [500, 'Notes cannot exceed 500 characters'],
    },
    fulfilledAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// ─── Indexes for efficient querying ───────────────────────────────────────────
bloodRequestSchema.index({ bloodGroup: 1, city: 1, status: 1 });
bloodRequestSchema.index({ requester: 1 });
bloodRequestSchema.index({ urgency: 1, status: 1 });

module.exports = mongoose.model('BloodRequest', bloodRequestSchema);
