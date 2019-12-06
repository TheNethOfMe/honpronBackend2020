const Entry = require("../models/Entry");

// @desc    Get all Entries
// @route   GET /api/v1/entries
// @access  Public
exports.getEntries = async (req, res, next) => {
  try {
    const entries = await Entry.find();
    res
      .status(200)
      .json({ success: true, count: entries.length, data: entries });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

// @desc    Create an Entry
// @route   POST /api/v1/entries
// @access  Private (ADMIN ONLY)
exports.createEntry = async (req, res, next) => {
  try {
    const entry = await Entry.create(req.body);
    res.status(201).json({ success: true, data: entry });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

// @desc    Get one Entry
// @route   GET /api/v1/entries/:id
// @access  Public
exports.getEntry = async (req, res, next) => {
  try {
    const entry = await Entry.findById(req.params.id);
    if (!entry) {
      return res.status(400).json({ success: false });
    }
    res.status(200).json({ success: true, data: entry });
  } catch (err) {
    // res.status(400).json({ success: false });
    next(err);
  }
};

// @desc    Update one Entry
// @route   PUT /api/v1/entries/:id
// @access  Private
exports.updateEntry = async (req, res, next) => {
  try {
    const entry = await Entry.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!entry) {
      return res.status(400).json({ success: false });
    }
    res.status(200).json({ success: true, data: entry });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

// @desc    Delete one Entry
// @route   DELETE /api/v1/entries/:id
// @access  Private
exports.deleteEntry = async (req, res, next) => {
  try {
    const entry = await Entry.findByIdAndDelete(req.params.id);
    if (!entry) {
      return res.status(400).json({ success: false });
    }
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};
