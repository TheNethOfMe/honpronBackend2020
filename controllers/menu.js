const Menu = require("../models/Menu");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/asyncHandler");

// @desc    Get full Menu
// @route   GET /api/v1/menu
// @access  Public
exports.getMenu = asyncHandler(async (req, res, next) => {
  const menu = await Menu.find().sort({ order: 1 });
  res.status(200).json({ success: true, data: menu });
});

// @desc    Create a Menu Item
// @route   POST /api/v1/menu
// @access  Private/Admin
exports.createMenuItem = asyncHandler(async (req, res, next) => {
  const menu = await Menu.create(req.body);
  res.status(201).json({ success: true, data: menu });
});

// @desc    Delete one Menu Item
// @route   DELETE /api/v1/menu/:id
// @access  Private/Admin
exports.deleteMenuItem = asyncHandler(async (req, res, next) => {
  const menu = await Menu.findByIdAndDelete(req.params.id);
  if (!menu) {
    return next(
      new ErrorResponse(`Menu item not found with id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({ success: true, data: {} });
});
