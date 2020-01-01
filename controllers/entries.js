const Entry = require("../models/Entry");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");

// @desc    Get all Entries
// @route   GET /api/v1/entries
// @access  Public
exports.getEntries = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedEntries);
});

// @desc    Create an Entry
// @route   POST /api/v1/entries
// @access  Private (ADMIN ONLY)
exports.createEntry = asyncHandler(async (req, res, next) => {
  const entry = await Entry.create(req.body);
  res.status(201).json({ success: true, data: entry });
});

// @desc    Get one Entry
// @route   GET /api/v1/entries/:id
// @access  Public
exports.getEntry = asyncHandler(async (req, res, next) => {
  const entry = await Entry.findById(req.params.id);
  if (!entry) {
    return next(
      new ErrorResponse(`Entry not found with id of ${req.params.id}`, 404)
    );
  }
});

// @desc    Update one Entry
// @route   PUT /api/v1/entries/:id
// @access  Private
exports.updateEntry = asyncHandler(async (req, res, next) => {
  const entry = await Entry.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  if (!entry) {
    return next(
      new ErrorResponse(`Entry not found with id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({ success: true, data: entry });
});

// @desc    Delete one Entry
// @route   DELETE /api/v1/entries/:id
// @access  Private
exports.deleteEntry = asyncHandler(async (req, res, next) => {
  const entry = await Entry.findByIdAndDelete(req.params.id);
  if (!entry) {
    return next(
      new ErrorResponse(`Entry not found with id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({ success: true, data: {} });
});
