const express = require("express");
const router = express.Router();
const {
  getSeries,
  createSeries,
  getOneSeriesWithEntries,
  getOneSeries,
  updateSeries,
  deleteSeries
} = require("../controllers/series");
const Series = require("../models/Series");
const {
  advancedQuery,
  advancedSeries
} = require("../middleware/advancedQuery");

const { protect, adminOnly } = require("../middleware/auth");

router.get("/:id/noentry", getOneSeries);

router
  .route("/")
  .get(advancedQuery(Series), getSeries)
  .post(protect, adminOnly(), createSeries);

router
  .route("/:id")
  .get(advancedSeries(), getOneSeriesWithEntries)
  .put(protect, adminOnly(), updateSeries)
  .delete(protect, adminOnly(), deleteSeries);

module.exports = router;
