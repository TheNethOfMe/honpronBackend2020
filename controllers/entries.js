const Entry = require("../models/Entry");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const path = require("path");

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
  res.status(201).json({ success: true, data: entry });
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
// @access  Private (ADMIN ONLY)
exports.deleteEntry = asyncHandler(async (req, res, next) => {
  const entry = await Entry.findByIdAndDelete(req.params.id);
  if (!entry) {
    return next(
      new ErrorResponse(`Entry not found with id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({ success: true, data: {} });
});

// @desc    Upload photo
// @route   PUT /api/v1/entries/:id/photo
// @access  Private (ADMIN ONLY)
exports.entryPhotoUpload = asyncHandler(async (req, res, next) => {
  const entry = await Entry.findById(req.params.id);
  if (!entry) {
    return next(
      new ErrorResponse(`Entry not found with id of ${req.params.id}`, 404)
    );
  }
  if (!req.files) {
    return next(new ErrorResponse("Please upload a file.", 400));
  }
  const file = req.files.file;
  // Make sure image is photo
  if (!file.mimetype.startsWith("image")) {
    return next(new ErrorResponse("Uploaded file must be an image", 400));
  }

  // Check filesize
  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new ErrorResponse(
        `Please upload a file smaller than ${process.env.MAX_FILE_UPLOAD}`,
        400
      )
    );
  }

  // Create custom filename
  file.name = `photo_${entry._id}${path.parse(file.name).ext}`;

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
    if (err) {
      console.error(err);
      return next(new ErrorResponse("Problem uploading file.", 500));
    }
    await Entry.findByIdAndUpdate(req.params._id, { image: file.name });
    res.status(200).json({ success: true, data: file.name });
  });
});
