const mongoose = require("mongoose");

const MenuSchema = new mongoose.Schema({
  menuType: {
    type: String,
    required: [true, "Menu items must be of type 'main' or 'sub'."],
    enum: ["main", "sub"]
  },
  displayText: {
    type: String,
    required: [true, "Please enter the text you want to display."]
  },
  url: {
    type: String,
    required: [true, "Please enter url menu item will link to."]
  },
  order: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model("Menu", MenuSchema);
