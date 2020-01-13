const mongoose = require("mongoose");
const ErrorResponse = require("../utils/errorResponse");

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
  series: {
    type: mongoose.Schema.ObjectId,
    ref: "Series"
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

// Add series property to comment to make cascade deletes easier
CommentSchema.pre("save", async function(next) {
  const entry = await this.model("Entry").findById(this.entry);
  if (!entry) {
    return next(
      new ErrorResponse(`Entry not found with id of ${req.params.id}`, 404)
    );
  }
  this.series = entry.series;
  next();
});

module.exports = mongoose.model("Comment", CommentSchema);
