if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}
const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const dbUrl = process.env.MONGO_URL;

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(dbUrl);
}

const initDB = async () => {
  await Listing.deleteMany({}); // Clear existing listings
  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: "688468d26fd04a6c31cab41e",
  }));
  await Listing.insertMany(initData.data); // Insert initial data
  console.log("data was initialized");
};

// initDB();
