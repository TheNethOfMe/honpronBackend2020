const Faq = require("../models/Faq");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/asyncHandler");

// @desc    Get all FAQs
// @route   GET /api/v1/faqs
// @access  Public
exports.getAllFaqs = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedData);
});

// @desc    Create one FAQ
// @route   POST /api/v1/faqs
// @access  Private/Admin
exports.createFaq = asyncHandler(async (req, res, next) => {
  const faq = await Faq.create(req.body);
  res.status(201).json({ success: true, data: faq });
});

// @desc    Get one FAQ
// @route   GET /api/v1/faqs/:id
// @access  Private/Admin
exports.getSingleFaq = asyncHandler(async (req, res, next) => {
  const faq = await Faq.findById(req.params.id);
  res.status(200).json({ success: true, data: faq });
});

// @desc    Update one FAQ
// @route   PUT /api/v1/faqs/:id
// @access  Private/Admin
exports.updateFaq = asyncHandler(async (req, res, next) => {
  const faq = await Faq.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  if (!faq) {
    return next(new ErrorResponse("Faq not found.", 404));
  }
  res.status(200).json({ success: true, data: faq });
});

// @desc    Delete one FAQ
// @route   DELETE /api/v1/faqs/:id
// @access  Private/Admin
exports.deleteFaq = asyncHandler(async (req, res, next) => {
  const faq = await Faq.findById(req.params.id);
  if (!faq) {
    return next(new ErrorResponse("Faq not found.", 404));
  }
  faq.remove();
  res.status(200).json({ success: true, data: {} });
});
