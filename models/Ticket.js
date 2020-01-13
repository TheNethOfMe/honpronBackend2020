const mongoose = require("mongoose");
const colorCoding = require("../utils/colorCoding");

const TicketSchema = new mongoose.Schema({
  subject: {
    type: String,
    default: "(No Default)"
  },
  topic: {
    type: String,
    default: "Other"
  },
  text: {
    type: String,
    required: [true, "You must enter text to send a message."]
  },
  dateAdded: {
    type: Date,
    default: Date.now
  },
  colorCode: {
    type: String,
    enum: ["blue", "yellow", "red", "black"]
  },
  closed: {
    type: Boolean,
    default: false
  },
  author: String
});

TicketSchema.pre("save", async function(next) {
  this.colorCode = colorCoding(this.text);
  next();
});

module.exports = mongoose.model("Ticket", TicketSchema);
