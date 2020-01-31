const path = require("path");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const fileupload = require("express-fileupload");
const cookieParser = require("cookie-parser");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");

// Load env variables
dotenv.config({ path: "./config/config.env" });

// Connect to DB
connectDB();

// Route files
const whitelist = require("./routes/whitelist");
const entries = require("./routes/entries");
const series = require("./routes/series");
const menu = require("./routes/menu");
const auth = require("./routes/auth");
const users = require("./routes/users");
const gamelist = require("./routes/gamelist");
const tickets = require("./routes/tickets");
const comments = require("./routes/comments");
const faqs = require("./routes/faqs");

const app = express();
app.use(express.json());

// Logger (for testing only)
const logger = (req, res, next) => {
  console.log("Hello", req.headers);
  next();
}
app.use(logger);

// Middleware npm packages
app.use(fileupload());
app.use(cookieParser());
app.use(mongoSanitize());
app.use(helmet());
app.use(xss());
app.use(hpp());

// Enable CORS
const corsOptions = {
  origin: process.env.CORS_WHITELIST
}
app.use(cors());

// rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 100
});
app.use(limiter);

// Set static folder
app.use(express.static(path.join(__dirname, "public")));

// Mount routers
app.use("/api/v1/whitelist", whitelist);
app.use("/api/v1/entries", entries);
app.use("/api/v1/series", series);
app.use("/api/v1/menu", menu);
app.use("/api/v1/auth", auth);
app.use("/api/v1/users", users);
app.use("/api/v1/gamelist", gamelist);
app.use("/api/v1/tickets", tickets);
app.use("/api/v1/comments", comments);
app.use("/api/v1/faqs", faqs);

app.use(errorHandler);

const port = process.env.PORT || 5000;
const server = app.listen(
  port,
  console.log(`Server Running in ${process.env.NODE_ENV} on port ${port}`)
);

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server and exit process
  server.close(() => process.exit(1));
});
