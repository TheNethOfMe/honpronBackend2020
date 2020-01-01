const express = require("express");
const {
  getSeries,
  createSeries,
  getOneSeries
} = require("../controllers/series");
const router = express.Router();
const advancedEntries = require("../middleware/advancedEntries");

router
  .route("/")
  .get(getSeries)
  .post(createSeries);

router.route("/:id").get(advancedEntries(true), getOneSeries);

module.exports = router;
