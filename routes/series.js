const express = require("express");
const {
  getSeries,
  createSeries,
  getOneSeriesWithEntries,
  updateSeries,
  deleteSeries
} = require("../controllers/series");
const router = express.Router();
const { advancedSeries } = require("../middleware/advancedQuery");

router
  .route("/")
  .get(getSeries)
  .post(createSeries);

router
  .route("/:id")
  .get(advancedSeries(), getOneSeriesWithEntries)
  .put(updateSeries)
  .delete(deleteSeries);

module.exports = router;
