const Series = require("../models/Series");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");

// @desc    Get all Series
// @route   GET /api/v1/series
// @access  Public
exports.getSeries = asyncHandler(async (req, res, next) => {
  const series = await Series.find();
  res.status(200).json({ success: true, count: series.length, data: series });
});

// @desc    Create an Series
// @route   POST /api/v1/series
// @access  Private (ADMIN ONLY)
exports.createSeries = asyncHandler(async (req, res, next) => {
  const series = await Series.create(req.body);
  res.status(201).json({ success: true, data: series });
});

// @desc    Get one Series with all Entries in series
// @route   GET /api/v1/series/:id
// @access  Public
exports.getOneSeriesWithEntries = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedSeries);
});

// @desc    Update Series
// @route   PUT /api/v1/series/:id
// @access  Private
exports.updateSeries = asyncHandler(async (req, res, next) => {
  const series = await Series.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  if (!series) {
    return next(
      new ErrorResponse(`Series not found with id ${req.params.id}`, 404)
    );
  }
  res.status(200).json({ success: true, data: series });
});

exports.deleteSeries = asyncHandler(async (req, res, next) => {
  const series = await Series.findById(req.params.id);
  if (!series) {
    return next(
      new ErrorResponse(`Series not found with id ${req.params.id}`, 404)
    );
  }
  series.remove();
  res.status(200).json({ success: true, data: {} });
});
