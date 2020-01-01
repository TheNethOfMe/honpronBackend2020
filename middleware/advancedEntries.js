const Entry = require("../models/Entry");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const advancedEntries = searchBySeries => async (req, res, next) => {
  let query;

  // Copy request query and remove certain fields
  const reqQuery = { ...req.query };
  const removeFields = ["select", "sort", "page", "limit"];
  removeFields.forEach(param => delete reqQuery[param]);

  let queryObj;

  // Construct query
  if (searchBySeries) {
    const seriesId = new ObjectId(req.params.id);
    queryObj = { series: seriesId };
  } else {
    let queryStr = JSON.stringify(reqQuery);
    queryStr = queryStr.replace(
      /\b(gt|gte|lt|lte|in)\b/g,
      match => `$${match}`
    );
    queryObj = JSON.parse(queryStr);
  }
  query = Entry.find(queryObj);

  // Add select and sort to query if applicable
  if (req.query.select) {
    const fields = req.query.select.split(",").join(" ");
    query = query.select(fields);
  }
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    query = query.sort(sortBy);
  } else {
    query = query.sort("-dateAdded");
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Entry.countDocuments(queryObj);

  query = query.skip(startIndex).limit(limit);

  // Execute query
  const results = await query;

  // Pagination result
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
  res.advancedEntries = {
    success: true,
    count: results.length,
    pagination,
    data: results
  };
  next();
};

module.exports = advancedEntries;
