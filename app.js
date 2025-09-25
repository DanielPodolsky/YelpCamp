import express from "express";
import { fileURLToPath } from "url";
import path from "path";
import mongoose from "mongoose";
import Campground from "./models/campground.js";
import Review from "./models/review.js";
import methodOverride from "method-override";
import ejsMate from "ejs-mate";
import ExpressError from "./utils/ExpressError.js";
import catchAsync from "./utils/catchAsync.js";
import Joi from "joi";
import { campgroundSchema, reviewSchema } from "./schemas.js";

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

const validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((element) => element.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((element) => element.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/campgrounds", async (req, res, next) => {
  try {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
  } catch (err) {
    next(err);
  }
});

app.get("/campgrounds/new", (req, res, next) => {
  res.render("campgrounds/new");
});

app.get("/campgrounds/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate("reviews");
    res.render("campgrounds/show", { campground });
  } catch (err) {
    next(err);
  }
});

app.post("/campgrounds", validateCampground, async (req, res, next) => {
  try {
    // if (!req.body.campground) {
    //   throw new ExpressError("Invalid Campground Data", 400);
    // }
    const newCampground = new Campground({ ...req.body.campground });
    await newCampground.save();
    res.redirect(`/campgrounds/${newCampground._id}`);
  } catch (err) {
    next(err);
  }
});

app.get("/campgrounds/:id/edit", validateCampground, async (req, res, next) => {
  try {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    res.render("campgrounds/edit", { campground });
  } catch (err) {
    next(err);
  }
});

app.put("/campgrounds/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedCampground = await Campground.findByIdAndUpdate(
      id,
      req.body.campground,
      { new: true }
    );
    res.redirect(`/campgrounds/${updatedCampground._id}`);
  } catch (err) {
    next(err);
  }
});

app.delete("/campgrounds/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedCampground = await Campground.findByIdAndDelete(id);
    res.redirect("/campgrounds");
  } catch (err) {
    next(err);
  }
});

app.post("/campgrounds/:id/reviews", validateReview, async (req, res) => {
  const id = req.params.id;
  const campground = await Campground.findById(id);
  const review = new Review(req.body.review);
  campground.reviews.push(review);
  await review.save();
  await campground.save();
  res.redirect(`/campgrounds/${id}`);
});

app.delete("/campgrounds/:id/reviews/:reviewId", async (req, res) => {
  try {
    const { id, reviewId } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {
      $pull: {
        reviews: reviewId,
      },
    });
    const review = await Review.findByIdAndDelete(reviewId);
    res.redirect(`/campgrounds/${id}`);
  } catch (err) {
    next(err);
  }
});

app.all(/(.*)/, (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) {
    err.message = "Oh no, something went wrong!";
  }
  res.status(statusCode).render("error", { err });
});

app.listen(3000, () => {
  console.log("Listening on port 3000.");
});
