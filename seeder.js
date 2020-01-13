const fs = require("fs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

// Load env variables
dotenv.config({ path: "./config/config.env" });

// Load models
const WhiteList = require("./models/Whitelist");
const Comment = require("./models/Comment");
const Entry = require("./models/Entry");
const GameList = require("./models/GameList");
const Menu = require("./models/Menu");
const Series = require("./models/Series");
const Ticket = require("./models/Ticket");
const User = require("./models/User");

// Connect DB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true
});

// Get Data
const whitelist = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/whitelist.json`)
);
const comments = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/comments.json`)
);
const fake = JSON.parse(fs.readFileSync(`${__dirname}/_data/fake.json`));
const gameList = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/gameList.json`)
);
const menu = JSON.parse(fs.readFileSync(`${__dirname}/_data/menu.json`));
const podcasts = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/podcasts.json`)
);
const series = JSON.parse(fs.readFileSync(`${__dirname}/_data/series.json`));
const tickets = JSON.parse(fs.readFileSync(`${__dirname}/_data/tickets.json`));
const users = JSON.parse(fs.readFileSync(`${__dirname}/_data/users.json`));

// import into db
const importData = async () => {
  try {
    await WhiteList.create(whitelist);
    await User.create(users);
    await Series.create(series);
    await Entry.create(podcasts);
    await Entry.create(fake);
    await Menu.create(menu);
    await GameList.create(gameList);
    await Ticket.create(tickets);
    await Comment.create(comments);
    console.log("Data imported...");
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

// delete data
const deleteData = async () => {
  try {
    await Entry.deleteMany();
    await Series.deleteMany();
    await Menu.deleteMany();
    await GameList.deleteMany();
    await User.deleteMany();
    await Ticket.deleteMany();
    await Comment.deleteMany();
    await WhiteList.deleteMany();
    console.log("Data destroyed...");
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

if (process.argv[2] === "-i") {
  console.log("IMPORT");
  importData();
} else if (process.argv[2] === "-d") {
  console.log("DELETE");
  deleteData();
} else {
  console.log("Please use argument -i for import or -d for delete.");
  process.exit();
}
