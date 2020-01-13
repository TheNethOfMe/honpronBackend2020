const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, "Please add your review."],
    maxlength: 280
  },
  dateAdded: {
    type: Date,
    default: Date.now
  },
  entry: {
    type: mongoose.Schema.ObjectId,
    ref: "Entry",
    required: true
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true
  },
  isApproved: {
    type: Boolean,
    default: false
  },
  colorCode: {
    type: String,
    enum: ["blue", "yellow", "red", "black"]
  }
});

module.exports = mongoose.model("Comment", CommentSchema);
