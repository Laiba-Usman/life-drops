const asyncHandler = require('../../utils/asyncHandler');
const ApiResponse = require('../../utils/ApiResponse');
const { getInventory, updateInventory, adjustInventory } = require('./bloodbank.service');

// ─── GET /api/bloodbank/inventory ─────────────────────────────────────────────
const getStock = asyncHandler(async (req, res) => {
  const inventory = await getInventory();
  res.status(200).json(new ApiResponse(200, inventory, 'Inventory fetched successfully'));
});

// ─── PATCH /api/bloodbank/inventory/:bloodGroup  (Admin) ─────────────────────
const setStock = asyncHandler(async (req, res) => {
  const { bloodGroup } = req.params;
  const { units } = req.body;

  const record = await updateInventory(bloodGroup, Number(units), req.user._id);
  res.status(200).json(new ApiResponse(200, record, `Inventory updated for ${bloodGroup}`));
});

// ─── PATCH /api/bloodbank/inventory/:bloodGroup/adjust  (Admin) ───────────────
const adjustStock = asyncHandler(async (req, res) => {
  const { bloodGroup } = req.params;
  const { delta } = req.body; // positive to add, negative to deduct

  const record = await adjustInventory(bloodGroup, Number(delta), req.user._id);
  res.status(200).json(new ApiResponse(200, record, `Inventory adjusted for ${bloodGroup}`));
});

module.exports = { getStock, setStock, adjustStock };
