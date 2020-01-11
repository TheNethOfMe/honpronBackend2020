const crypto = require("crypto");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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

// Encrypt password on save unless password is not modified
UserSchema.pre("save", async function(next) {
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

module.exports = mongoose.model("User", UserSchema);
