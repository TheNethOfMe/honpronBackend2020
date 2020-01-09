const Comment = require("../models/Comment");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/asyncHandler");

// @desc    Get all Comments made by user
// @route   GET /api/v1/comments
// @access  Private/Own Resources
exports.getMyComments = asyncHandler(async (req, res, next) => {
  const comments = await Comment.find({ user: req.user.id })
    .sort("-dateAdded")
    .populate({
      path: "entry",
      select: "title"
    });
  res
    .status(200)
    .json({ success: true, count: comments.length, data: comments });
});

// @desc    Get all Comments
// @route   GET /api/v1/comments/admin
// @access  Private/Admin
exports.getAllComments = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedData);
});

// @desc    Create a Comment
// @route   POST /api/v1/entries/:entryId/comment
// @access  Private
exports.createComment = asyncHandler(async (req, res, next) => {
  const comment = {
    text: req.body.text,
    entry: req.params.entryId,
    user: req.user.id
  };
  await Comment.create(comment);
  res.status(201).json({ success: true, data: comment });
});

// @desc    Update a Comment
// @route   PUT /api/v1/comments/:id
// @access  Private/Admin
exports.updateComment = asyncHandler(async (req, res, next) => {
  const comment = await Comment.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  if (!comment) {
    return next(new ErrorResponse("Comment not found", 404));
  }
  res.status(200).json({ success: true, data: comment });
});

// @desc    Delete a Comment
// @route   Delete /api/v1/comments/:id
// @access  Private/Admin or Own Resource
exports.deleteComment = asyncHandler(async (req, res, next) => {
  const comment = await Comment.findById(req.params.id);
  if (!comment) {
    return next(new ErrorResponse("Comment not found", 404));
  }
  if (comment.user.toString() !== req.user.id && req.user.status !== "admin") {
    return next(
      new ErrorResponse("Not authorized to update this review.", 401)
    );
  }
  await comment.remove();
  res.status(200).json({ success: true, data: {} });
});
