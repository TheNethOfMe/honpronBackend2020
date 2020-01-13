const mongoose = require("mongoose");

const WhitelistSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Please add an email."],
    unique: [true, "Email already in use."],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please enter a valid email."
    ]
  },
  // some marker (perhaps from patreon) to identify user if email changes
  identity: {
    type: String,
    required: true
  },
  isActivated: {
    type: Boolean,
    default: false
  }
});

WhitelistSchema.pre("save", function(next) {
  // Force email addresses to lowercase for consitancy
  this.email = this.email.toLowerCase();
  next();
});

module.exports = mongoose.model("Whitelist", WhitelistSchema);
