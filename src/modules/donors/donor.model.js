const mongoose = require('mongoose');
const { BLOOD_GROUPS } = require('../../config/constants');

const donorSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
      unique: true,
    },
    bloodGroup: {
      type: String,
      required: [true, 'Blood group is required'],
      enum: {
        values: BLOOD_GROUPS,
        message: 'Invalid blood group. Must be one of: ' + BLOOD_GROUPS.join(', '),
      },
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
    },
    age: {
      type: Number,
      required: [true, 'Age is required'],
      min: [18, 'Donor must be at least 18 years old'],
      max: [65, 'Donor must be 65 or younger'],
    },
    weight: {
      type: Number,
      min: [50, 'Donor must weigh at least 50 kg'],
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    lastDonated: {
      type: Date,
      default: null,
    },
    totalDonations: {
      type: Number,
      default: 0,
      min: 0,
    },
    medicalConditions: {
      type: String,
      maxlength: [500, 'Medical conditions text cannot exceed 500 characters'],
      default: 'None',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ─── Virtual: eligible to donate (must be 90 days after last donation) ────────
donorSchema.virtual('isEligible').get(function () {
  if (!this.lastDonated) return true;
  const daysSince = (Date.now() - this.lastDonated) / (1000 * 60 * 60 * 24);
  return daysSince >= 90;
});

// ─── Index for fast blood group + city search ─────────────────────────────────
donorSchema.index({ bloodGroup: 1, city: 1 });
donorSchema.index({ isAvailable: 1 });

module.exports = mongoose.model('Donor', donorSchema);
