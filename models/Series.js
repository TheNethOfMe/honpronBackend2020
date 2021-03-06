const mongoose = require("mongoose");
const slugify = require("slugify");

const SeriesSchema = new mongoose.Schema(
  {
    seriesName: {
      type: String,
      required: [true, "A name for the series is required."]
    },
    seriesType: {
      type: String,
      required: [true, "The type must be a podcast, video, or blog."],
      enum: ["podcast", "video", "blog"]
    },
    seriesDesc: {
      type: String
    },
    slug: {
      type: String
    },
    dateAdded: {
      type: Date,
      default: Date.now
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// crate slug from title
SeriesSchema.pre("save", function(next) {
  this.slug = slugify(this.seriesName, {
    lower: true
  });
  next();
});

// cascade delete entries and comments for series when series is deleted
SeriesSchema.pre("remove", async function(next) {
  await this.model("Entry").deleteMany({ series: this._id });
  await this.model("Comment").deleteMany({ series: this._id });
  next();
});

// virtuals
SeriesSchema.virtual("entries", {
  ref: "Entry",
  localField: "_id",
  foreignField: "series",
  justOne: false
});

module.exports = mongoose.model("Series", SeriesSchema);
