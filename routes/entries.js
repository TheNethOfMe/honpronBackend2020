const express = require("express");
const router = express.Router();
const {
  getEntries,
  createEntry,
  getEntry,
  updateEntry,
  deleteEntry,
  entryPhotoUpload
} = require("../controllers/entries");
const Entry = require("../models/Entry");
const { advancedQuery } = require("../middleware/advancedQuery");

router.route("/:id/photo").put(entryPhotoUpload);

router
  .route("/")
  .get(advancedQuery(Entry), getEntries)
  .post(createEntry);

router
  .route("/:id")
  .get(getEntry)
  .put(updateEntry)
  .delete(deleteEntry);

module.exports = router;

// todos Add functionality for fav and unfav and get all user favs (could go in user routes or its own routes)
