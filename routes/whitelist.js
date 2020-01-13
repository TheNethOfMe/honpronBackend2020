const express = require("express");
const router = express.Router();
const {
  getWhitelist,
  createWhitelist,
  getOneWhitelistEmail,
  updateWhitelist,
  deleteWhitelist
} = require("../controllers/whitelist");
const Whitelist = require("../models/Whitelist");

const { advancedQuery } = require("../middleware/advancedQuery");
const { protect, adminOnly } = require("../middleware/auth");

router.use(protect);
router.use(adminOnly());

router
  .route("/")
  .get(advancedQuery(Whitelist), getWhitelist)
  .post(createWhitelist);
router
  .route("/:id")
  .get(getOneWhitelistEmail)
  .put(updateWhitelist)
  .delete(deleteWhitelist);

module.exports = router;
