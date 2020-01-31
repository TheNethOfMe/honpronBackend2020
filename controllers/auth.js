const crypto = require("crypto");
const User = require("../models/User");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/asyncHandler");
const sendEmail = require("../utils/sendEmail");
const sendTokenResponse = require("../utils/sendTokenResponse");
const colorCoding = require("../utils/colorCoding");

// @desc    Register User
// @route   POST /api/v1/auth/register
// @access  Public
exports.register = asyncHandler(async (req, res, next) => {
  // TODO: Impliment whitelist and check to make sure user's email is on it
  const { name, email, password } = req.body;
  const user = await User.create({
    name,
    email,
    password
  });
  sendTokenResponse(user, 200, res);
});

// @desc    Login User
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  // Validate email & password
  if (!email || !password) {
    return next(
      new ErrorResponse("Please enter your email and password.", 400)
    );
  }
  // Force email to lowercase characters for consistancy
  req.body.email = req.body.email.toLowerCase();
  // Check for user
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorResponse("Invalid credentials.", 401));
  }
  // Make sure user is not blocked
  if (user.status === "blocked") {
    return next(new ErrorResponse("Your credentials have been revoked.", 401));
  }
  // Check for password
  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return next(new ErrorResponse("Invalid credentials.", 401));
  }
  sendTokenResponse(user, 200, res);
});

// @desc    Logout currently logged in user
// @route   GET /api/v1/auth/logout
// @access  Private
exports.logout = asyncHandler(async (req, res, next) => {
  console.log(req.headers.cookie);
  res.cookie("hpToken", "none", {
    expires: new Date(Date.now + 10 * 1000),
    httpOnly: true
  });
  res.status(200).json({ success: true, data: {} });
});

// @desc    Get current logged in user
// @route   GET /api/v1/auth/me
// @access  Private
exports.getMe = asyncHandler(async (req, res, next) => {
  const user = {
    name: req.user.name,
    email: req.user.email
  };
  res.status(200).json({ success: true, data: user });
});

// @desc    Update User Details
// @route   PUT /api/v1/auth/updatedetails
// @access  Private
exports.updateDetails = asyncHandler(async (req, res, next) => {
  const fieldsToUpdate = {
    name: req.body.name,
    email: req.body.email
  };
  const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
    new: true,
    runValidators: true
  });
  res.status(200).json({ success: true, data: user });
});

// @desc    Update User Password
// @route   PUT /api/v1/auth/updatepassword
// @access  Private
exports.updatePassword = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");
  // Check current password
  if (!(await user.matchPassword(req.body.currentPassword))) {
    next(new ErrorResponse("Password is incorrect", 401));
  }

  user.password = req.body.newPassword;
  await user.save();
  sendTokenResponse(user, 200, res);
});

// @desc    Forgot Password
// @route   POST /api/v1/auth/forgotpassword
// @access  Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  // Force email to lowercase characters for consistancy
  req.body.email = req.body.email.toLowerCase();
  const user = await User.findOne({ email: req.body.email });
  if (!user || user.status === "blocked") {
    return next(new ErrorResponse("Invalid email.", 404));
  }
  // Get reset token
  const resetToken = user.getResetPasswordToken();
  await user.save({
    validateBeforeSave: false
  });

  // Create reset url
  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/auth/resetpassword/${resetToken}`;
  const message = `You are receiving this email because you have requested a the reset of your password at Honest Piranha. Please make a PUT request to: \n\n ${resetUrl}`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Password Reset Token for Honest Piranha",
      message
    });
    res.status(200).json({ success: true });
  } catch (err) {
    console.log(err);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({
      validateBeforeSave: false
    });
    return next(new ErrorResponse("Email could not be sent.", 500));
  }

  res.status(200).json({ success: true, data: "Email Sent" });
});

// @desc    Reset Password
// @route   PUT /api/v1/auth/resetpassword/:resettoken
// @access  Public
exports.resetPassword = asyncHandler(async (req, res, next) => {
  // Get hashed token
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.resettoken)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() }
  });

  if (!user) {
    return next(new ErrorResponse("Invalid Token", 400));
  }

  // Set new Password
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  sendTokenResponse(user, 200, res);
});
