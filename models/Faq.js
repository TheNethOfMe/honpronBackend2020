const mongoose = require("mongoose");

const FaqSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true
  },
  answer: {
    type: String,
    required: true
  },
  dateAdded: {
    type: Date,
    default: Date.now
  },
  author: String
});

module.exports = mongoose.model("Faq", FaqSchema);
