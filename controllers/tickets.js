const Ticket = require("../models/Ticket");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/asyncHandler");

// @desc    Get all TIckets
// @route   GET /api/v1/tickets
// @access  Private/Admin
exports.getTickets = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedData);
});

// @desc    Create a TIckets
// @route   POST /api/v1/tickets
// @access  Public
exports.createTicket = asyncHandler(async (req, res, next) => {
  const ticket = {
    subject: req.body.subject,
    topic: req.body.topic,
    text: req.body.text
  };
  await Ticket.create(ticket);
  res.status(201).json({ success: true, data: ticket });
});

// @desc    Get one TIcket
// @route   GET /api/v1/tickets/:id
// @access  Private/Admin
exports.getSingleTicket = asyncHandler(async (req, res, next) => {
  const ticket = await Ticket.findById(req.params.id);
  res.status(200).json({ success: true, data: ticket });
});

// @desc    Update one TIcket
// @route   PUT /api/v1/tickets/:id
// @access  Private/Admin
exports.updateTicket = asyncHandler(async (req, res, next) => {
  const ticket = await Ticket.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  if (!ticket) {
    return next(new ErrorResponse("Ticket not found.", 404));
  }
  res.status(200).json({ success: true, data: ticket });
});

// @desc    Delete one TIcket
// @route   DELETE /api/v1/tickets/:id
// @access  Private/Admin
exports.deleteTicket = asyncHandler(async (req, res, next) => {
  const ticket = await Ticket.findById(req.params.id);
  if (!ticket) {
    return next(new ErrorResponse("Ticket not found.", 404));
  }
  ticket.remove();
  res.status(200).json({ success: true, data: {} });
});
