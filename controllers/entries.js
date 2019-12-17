const Entry = require("../models/Entry");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");

// @desc    Get all Entries
// @route   GET /api/v1/entries
// @access  Public
exports.getEntries = asyncHandler(async (req, res, next) => {
  let query;

  // make copy of query fields
  const reqQuery = { ...req.query };

  // remove certain fields from reqQuery object
  const removeFields = ["sort", "page", "limit", "games"];
  removeFields.forEach(param => delete reqQuery[param]);

  // create query string and format operators
  let queryStr = JSON.stringify(reqQuery);
  queryStr = queryStr.replace(/\b(in)\b/gi, match => `$${match}`);
  let queryObj = JSON.parse(queryStr);
  if (req.query.games) {
    queryObj.games = { $regex: req.query.games, $options: "i" };
    console.log(queryObj);
  }

  // sort query results
  let sortBy;
  if (req.query.sort) {
    sortBy = req.query.sort.split(",").join(" ");
  } else {
    sortBy = "-createdAt";
  }

  // pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Entry.countDocuments();

  // construct and execute query
  query = Entry.find(queryObj).sort(sortBy);
  query = query.skip(startIndex).limit(limit);
  const entries = await query;

  // pagination result
  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit
    };
  }

  res
    .status(200)
    .json({ success: true, count: entries.length, pagination, data: entries });
});

// @desc    Create an Entry
// @route   POST /api/v1/entries
// @access  Private (ADMIN ONLY)
exports.createEntry = asyncHandler(async (req, res, next) => {
  const entry = await Entry.create(req.body);
  res.status(201).json({ success: true, data: entry });
});

// @desc    Get one Entry
// @route   GET /api/v1/entries/:id
// @access  Public
exports.getEntry = asyncHandler(async (req, res, next) => {
  const entry = await Entry.findById(req.params.id);
  if (!entry) {
    return next(
      new ErrorResponse(`Entry not found with id of ${req.params.id}`, 404)
    );
  }
});

// @desc    Update one Entry
// @route   PUT /api/v1/entries/:id
// @access  Private
exports.updateEntry = asyncHandler(async (req, res, next) => {
  const entry = await Entry.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  if (!entry) {
    return next(
      new ErrorResponse(`Entry not found with id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({ success: true, data: entry });
});

// @desc    Delete one Entry
// @route   DELETE /api/v1/entries/:id
// @access  Private
exports.deleteEntry = asyncHandler(async (req, res, next) => {
  const entry = await Entry.findByIdAndDelete(req.params.id);
  if (!entry) {
    return next(
      new ErrorResponse(`Entry not found with id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({ success: true, data: {} });
});
