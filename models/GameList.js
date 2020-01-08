const mongoose = require("mongoose");

const GameListSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  current: {
    type: Boolean,
    required: true
  },
  list: {
    type: String
  }
});

module.exports = mongoose.model("GameList", GameListSchema);
