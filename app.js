const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js")

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  mongoose.connect(MONGO_URL);
};

app.listen(8080, () => {
  console.log("Server is listening to port 8080");
});

app.get("/", (req, res) => {
  res.send("Hi, i am root");
});

app.get("/testListing", async (req, res) => {
    let sampleListing = new Listing({
        title : "New villa",
        description : "By the beach",
        price : 1200,
        location : "Goa",
        country : "India"
    });
    await sampleListing.save();
    console.log("Sample was saved");
    res.send("Testing successful");
});