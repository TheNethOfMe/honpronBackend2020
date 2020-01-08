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

router.route("/current").get(getCurrentList);

router
  .route("/")
  .get(getAllGameLists)
  .post(createGameList);

router
  .route("/:id")
  .get(getOneGameList)
  .put(updateGameList)
  .delete(deleteGameList);

module.exports = router;
