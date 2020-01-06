const express = require("express");
const router = express.Router();
const {
  getUsers,
  createUser,
  getOneUser,
  updateUser,
  deleteUser
} = require("../controllers/users");
const User = require("../models/User");

const { advancedQuery } = require("../middleware/advancedQuery");
const { protect, adminOnly } = require("../middleware/auth");

router.use(protect);
router.use(adminOnly());

router
  .route("/")
  .get(advancedQuery(User), getUsers)
  .post(createUser);

router
  .route("/:id")
  .get(getOneUser)
  .put(updateUser)
  .delete(deleteUser);

module.exports = router;
