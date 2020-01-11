const express = require("express");
const router = express.Router({ mergeParams: true });
const {
  getMyComments,
  getAllComments,
  createComment,
  updateComment,
  deleteComment
} = require("../controllers/comments");

const Comment = require("../models/Comment");
const { advancedQuery } = require("../middleware/advancedQuery");
const { protect, adminOnly } = require("../middleware/auth");

router.get(
  "/admin",
  protect,
  adminOnly(),
  advancedQuery(Comment),
  getAllComments
);

router
  .route("/")
  .get(protect, getMyComments)
  .post(protect, createComment);

router
  .route("/:id")
  .put(protect, adminOnly(), updateComment)
  .delete(protect, deleteComment);

module.exports = router;
