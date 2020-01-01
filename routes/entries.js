const express = require("express");
const {
  getEntries,
  createEntry,
  getEntry,
  updateEntry,
  deleteEntry
} = require("../controllers/entries");
const router = express.Router();
const advancedEntries = require("../middleware/advancedEntries");

router
  .route("/")
  .get(advancedEntries(false), getEntries)
  .post(createEntry);

router
  .route("/:id")
  .get(getEntry)
  .put(updateEntry)
  .delete(deleteEntry);

module.exports = router;

// todos Add functionality for fav and unfav and get all user favs (could go in user routes or its own routes)
