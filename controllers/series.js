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
exports.getOneSeries = asyncHandler(async (req, res, next) => {
  const series = await Series.findById(req.params.id);
  res.advancedEntries.series = series;
  res.status(200).json(res.advancedEntries);
});
