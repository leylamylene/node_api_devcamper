const fs = require("fs");

const mongoose = require("mongoose");
const colors = require("colors");

const dotenv = require("dotenv");

//load env vars
dotenv.config({ path: "./config/config.env" });

const Bootcamp = require("./models/bootcamp");
const { log } = require("console");

//Connect db

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//read json files

const bootcamps = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/bootcamps.json`, "utf-8")
);

// import into db

const importData = async () => {
  try {
    await Bootcamp.create(bootcamps);
    log("Data inmported ...".green.inverse);
    process.exit();
  } catch (err) {
    log(err);
  }
};

//delete data

const deleteData = async () => {
  try {
    await Bootcamp.deleteMany();
    log("Data destroyed ...".red.inverse);
    process.exit();
  } catch (err) {
    log(err);
  }
};

if (process.argv[2] == "-i") {
  importData();
} else if (process.argv[2] == "-d") {
  deleteData();
}
