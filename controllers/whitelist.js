const Whitelist = require("../models/Whitelist");
const asyncHandler = require("../middleware/asyncHandler");

// @desc    Get all Whitelists
// @route   GET /api/v1/Whitelists
// @access  Private/Admin
exports.getWhitelist = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedData);
});

// @desc    Get one Whitelist
// @route   GET /api/v1/Whitelists/:id
// @access  Private/Admin
exports.getOneWhitelistEmail = asyncHandler(async (req, res, next) => {
  const whitelist = await Whitelist.findById(req.params.id);
  res.status(200).json({ success: true, data: whitelist });
});

// @desc    Create one Whitelist
// @route   POST /api/v1/Whitelists
// @access  Private/Admin
exports.createWhitelist = asyncHandler(async (req, res, next) => {
  const whitelist = await Whitelist.create(req.body);
  res.status(201).json({ success: true, data: whitelist });
});

// @desc    Update Whitelist
// @route   PUT /api/v1/Whitelists/:id
// @access  Private/Admin
exports.updateWhitelist = asyncHandler(async (req, res, next) => {
  const whitelist = await Whitelist.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  res.status(200).json({ success: true, data: whitelist });
});

// @desc    Delete Whitelist
// @route   DELETE /api/v1/Whitelists/:id
// @access  Private/Admin
exports.deleteWhitelist = asyncHandler(async (req, res, next) => {
  const whitelist = await Whitelist.findById(req.params.id);
  if (!whitelist) {
    return next(new ErrorResponse(`Email not found on Whitelist.`, 404));
  }
  whitelist.remove();
  res.status(200).json({ success: true, data: {} });
});
