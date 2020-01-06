const express = require("express");
const router = express.Router();
const {
  getMenu,
  createMenuItem,
  deleteMenuItem
} = require("../controllers/menu");

router
  .route("/")
  .get(getMenu)
  .post(createMenuItem);

router.route("/:id").delete(deleteMenuItem);

module.exports = router;
