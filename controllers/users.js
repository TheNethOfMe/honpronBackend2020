const User = require("../models/User");
const asyncHandler = require("../middleware/asyncHandler");

// @desc    Get all users
// @route   GET /api/v1/users
// @access  Private/Admin
exports.getUsers = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedData);
});

// @desc    Get one user
// @route   GET /api/v1/users/:id
// @access  Private/Admin
exports.getOneUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  res.status(200).json({ success: true, data: user });
});

// @desc    Create one user
// @route   POST /api/v1/users
// @access  Private/Admin
exports.createUser = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body);
  const result = {
    status: user.status,
    name: user.name,
    email: user.email,
    dateAdded: user.dateAdded,
    id: user._id
  };
  res.status(201).json({ success: true, data: result });
});

// @desc    Update user
// @route   PUT /api/v1/users/:id
// @access  Private/Admin
exports.updateUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  res.status(200).json({ success: true, data: user });
});

// @desc    Delete user
// @route   DELETE /api/v1/users/:id
// @access  Private/Admin
exports.deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(
      new ErrorResponse(`Series not found with id ${req.params.id}`, 404)
    );
  }
  user.remove();
  res.status(200).json({ success: true, data: {} });
});
