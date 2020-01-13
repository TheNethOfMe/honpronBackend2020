const crypto = require("crypto");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const colorCoding = require("../utils/colorCoding");
const ErrorResponse = require("../utils/errorResponse");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A name is required."],
    unique: [true, "That username is not available."]
  },
  email: {
    type: String,
    required: [true, "Please add an email."],
    unique: [true, "Email already in use."],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please enter a valid email."
    ]
  },
  // determines if a user is in good standing
  status: {
    type: String,
    enum: ["user", "blacklisted", "blocked"],
    default: "user"
  },
  password: {
    type: String,
    required: [true, "Please enter a password."],
    minlength: [6, "Your password must be at least 6 characters"],
    select: false
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  dateAdded: {
    type: Date,
    default: Date.now
  }
});

UserSchema.pre("save", async function(next) {
  // Force email addresses to lowercase for consitancy
  this.email = this.email.toLowerCase();
  // Ensure user is on the whitelist
  const whiteListed = await this.model("Whitelist").findOneAndUpdate(
    {
      email: this.email
    },
    { isActivated: true }
  );
  if (!whiteListed) {
    return next(
      new ErrorResponse(
        "Sorry, but you must be on the list to set up an account.",
        403
      )
    );
  }
  // Make sure username is acceptable
  const code = colorCoding(this.name);
  if (code !== "blue") {
    return next(new ErrorResponse("That username is not available.", 400));
  }
  // Encrypt password on save unless password is not modified
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function() {
  return jwt.sign(
    // TODO: perhaps other user props as well?
    { id: this._id },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  );
};

// Match user password with password in database
UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate and hash password reset token
UserSchema.methods.getResetPasswordToken = function() {
  const resetToken = crypto.randomBytes(20).toString("hex");
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

// Set comments to undefined user when user gets deleted
UserSchema.pre("remove", async function(next) {
  await this.model("Comment").deleteMany({ user: this._id });
  next();
});

module.exports = mongoose.model("User", UserSchema);
