const jwt = require("jsonwebtoken");
const asyncHandler = require("./asyncHandler");
const ErrorResponse = require("../utils/errorResponse");
const User = require("../models/User");

// Protect routes
exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.hpToken) {
    token = req.cookies.hpToken;
  }
  if (!token) {
    return next(new ErrorResponse("Not Authorized", 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    next();
  } catch (err) {
    return next(new ErrorResponse("Not Authorized", 401));
  }
});

// Grant access to specific roles
exports.adminOnly = () => {
  return (req, res, next) => {
    if (req.user.status !== "admin") {
      return next(new ErrorResponse(`Unauthorized`, 403));
    }
    next();
  };
};
