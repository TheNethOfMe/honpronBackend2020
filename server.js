const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

// Load env variables
dotenv.config({ path: "./config/config.env" });

// Connect to DB
connectDB();

// Route files
const entries = require("./routes/entries");

const app = express();
app.use(express.json());

// Mount routers
app.use("/api/v1/entries", entries);

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