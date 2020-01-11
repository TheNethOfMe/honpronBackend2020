const express = require("express");
const router = express.Router();
const {
  getMenu,
  createMenuItem,
  deleteMenuItem
} = require("../controllers/menu");

const { protect, adminOnly } = require("../middleware/auth");

router
  .route("/")
  .get(getMenu)
  .post(protect, adminOnly(), createMenuItem);

router.delete("/:id", protect, adminOnly(), deleteMenuItem);

module.exports = router;
