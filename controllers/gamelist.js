const GameList = require("../models/GameList");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/asyncHandler");
const getFormattedGameList = require("../utils/getFormattedGameList");

// @desc    Get one List formated
// @route   GET /api/v1/gamelist/current
// @access  Public
exports.getCurrentList = asyncHandler(async (req, res, next) => {
  const list = await GameList.findOne({ current: true });
  if (!list) {
    return next(new ErrorResponse(`No List Found`, 404));
  }
  const formattedList = getFormattedGameList(list.list, 1000);
  res.status(200).json({ success: true, data: formattedList });
});

// @desc    Get all Gamelist (no chunks)
// @route   GET /api/v1/gamelist
// @access  Private/Admin
exports.getAllGameLists = asyncHandler(async (req, res, next) => {
  const lists = await GameList.find().select("title current");
  res.status(200).json({ success: true, count: lists.count, data: lists });
});

// @desc    Create a new gamelist
// @route   POST /api/v1/gamelist
// @access  Private/Admin
exports.createGameList = asyncHandler(async (req, res, next) => {
  const list = await GameList.create(req.body);
  res.status(201).json({ success: true, data: list });
});

// @desc    Get One Gamelist data unformated
// @route   GET /api/v1/gamelist/:id
// @access  Private/Admin
exports.getOneGameList = asyncHandler(async (req, res, next) => {
  const list = await GameList.findById(req.params.id);
  if (!list) {
    return next(new ErrorResponse("Game list not found.", 404));
  }
  res.status(200).json({ success: true, data: list });
});

// @desc    Update One Gamelist data unformated
// @route   PUT /api/v1/gamelist/:id
// @access  Private/Admin
exports.updateGameList = asyncHandler(async (req, res, next) => {
  const list = await GameList.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  if (!list) {
    return next(new ErrorResponse("Game list not found.", 404));
  }
  res.status(200).json({ success: true, data: series });
});

// @desc    Delete Game List
// @route   DELETE /api/v1/gamelist/:id
// @access  Private/Admin
exports.deleteGameList = asyncHandler(async (req, res, next) => {
  const list = await GameList.findById(req.params.id);
  if (!list) {
    return next(new ErrorResponse("Game list not found.", 404));
  }
  list.remove();
  res.status(200).json({ success: true, data: {} });
});
