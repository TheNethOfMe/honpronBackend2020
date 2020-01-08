const express = require("express");
const router = express.Router();
const {
  getCurrentList,
  getAllGameLists,
  createGameList,
  getOneGameList,
  updateGameList,
  deleteGameList
} = require("../controllers/gamelist");
const { protect, adminOnly } = require("../middleware/auth");

router.route("/current").get(getCurrentList);

router
  .route("/")
  .get(protect, adminOnly(), getAllGameLists)
  .post(protect, adminOnly(), createGameList);

router
  .route("/:id")
  .get(protect, adminOnly(), getOneGameList)
  .put(protect, adminOnly(), updateGameList)
  .delete(protect, adminOnly(), deleteGameList);

module.exports = router;
