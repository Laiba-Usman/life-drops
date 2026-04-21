const mongoose = require('mongoose');
const { BLOOD_GROUPS } = require('../../config/constants');

const bloodBankSchema = new mongoose.Schema(
  {
    bloodGroup: {
      type: String,
      required: [true, 'Blood group is required'],
      enum: {
        values: BLOOD_GROUPS,
        message: 'Invalid blood group',
      },
      unique: true,
    },
    unitsAvailable: {
      type: Number,
      required: true,
      min: [0, 'Units cannot be negative'],
      default: 0,
    },
    lastUpdatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('BloodBank', bloodBankSchema);
