const express = require("express");
const router = express.Router();
const Faq = require("../models/Faq");
const {
  getAllFaqs,
  createFaq,
  getSingleFaq,
  updateFaq,
  deleteFaq
} = require("../controllers/faqs");
const { protect, adminOnly } = require("../middleware/auth");
const { advancedQuery } = require("../middleware/advancedQuery");

router
  .route("/")
  .get(advancedQuery(Faq), getAllFaqs)
  .post(protect, adminOnly(), createFaq);

router
  .route("/:id")
  .get(protect, adminOnly(), getSingleFaq)
  .put(protect, adminOnly(), updateFaq)
  .delete(protect, adminOnly(), deleteFaq);

module.exports = router;
