import mongoose from "mongoose";
import Campground from "../models/campground.js";
import { descriptors, places } from "./seedHelpers.js";
import cities from "./cities.js";

// The main purpose of the seeding is to first clear all the database so there wont be anything in there.
// Then, we will send information to our database.

mongoose.connect("mongodb://127.0.0.1:27017/yelp-camp"); // Connect to our db

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected.");
});

const sample = (arr) => arr[Math.floor(Math.random() * arr.length)];

const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 50; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;
    const camp = new Campground({
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      image: "https://picsum.photos/400?random=${Math.random()}",
      description:
        "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Accusantium necessitatibus quaerat et quas dicta? At temporibus hic nulla voluptatibus nostrum quasi corporis, autem a accusantium, impedit quisquam voluptatum eius provident.",
      price: price,
    });
    await camp.save();
  }
};

// Seed the database, then simply close it.
seedDB().then(() => {
  mongoose.connection.close();
});
