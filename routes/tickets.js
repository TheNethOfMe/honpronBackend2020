const express = require("express");
const router = express.Router();
const Ticket = require("../models/Ticket");
const {
  getTickets,
  createTicket,
  getSingleTicket,
  updateTicket,
  deleteTicket
} = require("../controllers/tickets");
const { protect, adminOnly } = require("../middleware/auth");
const { advancedQuery } = require("../middleware/advancedQuery");

router
  .route("/")
  .get(protect, adminOnly(), advancedQuery(Ticket), getTickets)
  .post(createTicket);

router
  .route("/:id")
  .get(protect, adminOnly(), getSingleTicket)
  .put(protect, adminOnly(), updateTicket)
  .delete(protect, adminOnly(), deleteTicket);
