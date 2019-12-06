const mongoose = require("mongoose");

const EntrySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please enter a title."],
    unique: true
  },
  slug: String,
  dateAdded: {
    type: Date,
    default: Date.now
  },
  entryType: {
    type: String,
    required: true,
    enum: ["podcast", "video", "blog"]
  },
  description: {
    type: String,
    required: true
  },
  series: {
    type: String,
    required: true
  },
  games: {
    type: [String]
  },
  image: {
    type: String
  },
  // podcast and video only
  urlId: {
    type: String
  },
  duration: {
    type: String
  }
});

module.exports = mongoose.model("Entry", EntrySchema);

// TODO: add information for Blogs, add comments and favs (may break out into it's own model)
