const BloodBank = require('./bloodbank.model');
const ApiError = require('../../utils/ApiError');
const { BLOOD_GROUPS } = require('../../config/constants');

// ─── Seed all blood groups if not present ─────────────────────────────────────
const seedInventory = async () => {
  for (const group of BLOOD_GROUPS) {
    await BloodBank.findOneAndUpdate(
      { bloodGroup: group },
      { $setOnInsert: { bloodGroup: group, unitsAvailable: 0 } },
      { upsert: true, new: true }
    );
  }
};

const getInventory = async () => {
  const inventory = await BloodBank.find().sort({ bloodGroup: 1 });
  return inventory;
};

const updateInventory = async (bloodGroup, units, adminId) => {
  if (!BLOOD_GROUPS.includes(bloodGroup)) {
    throw new ApiError(400, `Invalid blood group: ${bloodGroup}`);
  }
  if (typeof units !== 'number' || units < 0) {
    throw new ApiError(400, 'Units must be a non-negative number');
  }

  const record = await BloodBank.findOneAndUpdate(
    { bloodGroup },
    { unitsAvailable: units, lastUpdatedBy: adminId },
    { new: true, upsert: true, runValidators: true }
  );
  return record;
};

const adjustInventory = async (bloodGroup, delta, adminId) => {
  const record = await BloodBank.findOne({ bloodGroup });
  if (!record) throw new ApiError(404, `No inventory record found for ${bloodGroup}`);

  const newUnits = record.unitsAvailable + delta;
  if (newUnits < 0) throw new ApiError(400, 'Insufficient blood units in inventory');

  record.unitsAvailable = newUnits;
  record.lastUpdatedBy = adminId;
  await record.save();
  return record;
};

module.exports = { seedInventory, getInventory, updateInventory, adjustInventory };
