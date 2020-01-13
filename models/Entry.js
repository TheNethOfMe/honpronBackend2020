const mongoose = require("mongoose");
const slugify = require("slugify");

const EntrySchema = new mongoose.Schema(
  {
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
      required: [true, "The entry must be a podcast, video, or blog."],
      enum: ["podcast", "video", "blog"]
    },
    description: {
      type: String,
      required: [true, "Please enter a description."]
    },
    series: {
      type: mongoose.Schema.ObjectId,
      ref: "Series",
      required: [true, "Series is required."]
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
    },
    // Snescapades only
    episode: Number,
    gameList: {
      type: mongoose.Schema.ObjectId,
      ref: "GameList"
    },
    // blog only
    blog: {
      type: String
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// crate slug from title
EntrySchema.pre("save", function(next) {
  this.slug = slugify(this.title, {
    lower: true
  });
  next();
});

// reverse populate entries with comments
EntrySchema.virtual("comments", {
  ref: "Comment",
  localField: "_id",
  foreignField: "entry",
  justOne: false
});

// cascade delete comments for entry when entry is deleted
EntrySchema.pre("remove", async function(next) {
  await this.model("Comment").deleteMany({ entry: this._id });
  next();
});

module.exports = mongoose.model("Entry", EntrySchema);

// TODO: favs (may break out into it's own model)
