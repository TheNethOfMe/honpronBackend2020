const fs = require("fs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

// Load env variables
dotenv.config({ path: "./config/config.env" });

// Load models
const Entry = require("./models/Entry");
const Series = require("./models/Series");
const Menu = require("./models/Menu");
const GameList = require("./models/GameList");

// Connect DB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true
});

// Get Data
const entries = JSON.parse(fs.readFileSync(`${__dirname}/_data/podcasts.json`));
const fake = JSON.parse(fs.readFileSync(`${__dirname}/_data/fake.json`));
const series = JSON.parse(fs.readFileSync(`${__dirname}/_data/series.json`));
const menu = JSON.parse(fs.readFileSync(`${__dirname}/_data/menu.json`));
const gameList = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/gameList.json`)
);

// import into db
const importData = async () => {
  try {
    await Entry.create(entries);
    await Entry.create(fake);
    await Series.create(series);
    await Menu.create(menu);
    await GameList.create(gameList);
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
