const express = require("express");
const {
  getMenu,
  createMenuItem,
  deleteMenuItem
} = require("../controllers/menu");
const router = express.Router();

router
  .route("/")
  .get(getMenu)
  .post(createMenuItem);

router.route("/:id").delete(deleteMenuItem);

module.exports = router;
