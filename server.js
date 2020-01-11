const express = require("express");
const dotenv = require("dotenv");
const fileupload = require("express-fileupload");
const cookieParser = require("cookie-parser");
const path = require("path");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");

// Load env variables
dotenv.config({ path: "./config/config.env" });

// Connect to DB
connectDB();

// Route files
const entries = require("./routes/entries");
const series = require("./routes/series");
const menu = require("./routes/menu");
const auth = require("./routes/auth");
const users = require("./routes/users");
const gamelist = require("./routes/gamelist");
const tickets = require("./routes/tickets");
const comments = require("./routes/comments");

const app = express();
app.use(express.json());

// Middleware npm packages
app.use(fileupload());
app.use(cookieParser());

// Set static folder
app.use(express.static(path.join(__dirname, "public")));

// Mount routers
app.use("/api/v1/entries", entries);
app.use("/api/v1/series", series);
app.use("/api/v1/menu", menu);
app.use("/api/v1/auth", auth);
app.use("/api/v1/users", users);
app.use("/api/v1/gamelist", gamelist);
app.use("/api/v1/tickets", tickets);
app.use("/api/v1/comments", comments);

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
