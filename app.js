import express from "express";
import { fileURLToPath } from "url";
import path from "path";
import mongoose from "mongoose";
import Campground from "./models/campground.js";
import methodOverride from "method-override";
import ejsMate from "ejs-mate";

const app = express();
mongoose.connect("mongodb://127.0.0.1:27017/yelp-camp");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected.");
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename); // In ES Modules, this is the workflow.
app.set("views", path.join(__dirname, "views")); // This tells Express where to look for our template files.
app.set("view engine", "ejs"); // This tells which template engine to use for rendering views which in our case it's ejs.
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/campgrounds", async (req, res) => {
  try {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
  } catch (err) {
    console.error(err);
    res.send("Error fetching all camps.");
  }
});

app.get("/campgrounds/new", (req, res) => {
  res.render("campgrounds/new");
});

app.get("/campgrounds/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    res.render("campgrounds/show", { campground });
  } catch (err) {
    console.error(err);
    res.send("No Camp Found with that ID!");
  }
});

app.post("/campgrounds", async (req, res) => {
  try {
    const newCampground = new Campground({ ...req.body.campground });
    await newCampground.save();
    res.redirect(`/campgrounds/${newCampground._id}`);
  } catch (err) {
    console.error(err);
    res.send("Something went wrong with creating a new camp...");
  }
});

app.get("/campgrounds/:id/edit", async (req, res) => {
  try {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    res.render("campgrounds/edit", { campground });
  } catch (err) {
    console.error(err);
    res.send("There was an error editing a campground...");
  }
});

app.put("/campgrounds/:id", async (req, res) => {
  const { id } = req.params;
  const updatedCampground = await Campground.findByIdAndUpdate(
    id,
    req.body.campground,
    { new: true }
  );
  res.redirect(`/campgrounds/${updatedCampground._id}`);
});

app.delete("/campgrounds/:id", async (req, res) => {
  const { id } = req.params;
  const deletedCampground = await Campground.findByIdAndDelete(id);
  res.redirect("/campgrounds");
});

app.listen(3000, () => {
  console.log("Listening on port 3000.");
});
