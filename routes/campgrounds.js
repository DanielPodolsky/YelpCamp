import { Router } from "express";
import ExpressError from "../utils/ExpressError.js";
import Campground from "../models/campground.js";
import { campgroundSchema } from "../schemas.js";
import isLoggedIn from "../middleware.js";

const router = Router();

const validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((element) => element.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

router.get("/", async (req, res, next) => {
  try {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
  } catch (err) {
    next(err);
  }
});

router.get("/new", isLoggedIn, (req, res, next) => {
  res.render("campgrounds/new");
});

router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate("reviews");
    if (!campground) {
      req.flash("error", "Cannot find campground");
      return res.redirect("/campgrounds");
    }
    res.render("campgrounds/show", { campground });
  } catch (err) {
    next(err);
  }
});

router.post("/", isLoggedIn, validateCampground, async (req, res, next) => {
  try {
    // if (!req.body.campground) {
    //   throw new ExpressError("Invalid Campground Data", 400);
    // }
    const newCampground = new Campground({ ...req.body.campground });
    await newCampground.save();
    req.flash("success", "Succesfully made a new campground!");
    res.redirect(`/campgrounds/${newCampground._id}`);
  } catch (err) {
    next(err);
  }
});

router.get(
  "/:id/edit",
  isLoggedIn,
  validateCampground,
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const campground = await Campground.findById(id);
      if (!campground) {
        req.flash("error", "Cannot find campground");
        return res.redirect("/campgrounds");
      }
      res.render("campgrounds/edit", { campground });
    } catch (err) {
      next(err);
    }
  }
);

router.put("/:id", isLoggedIn, validateCampground, async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedCampground = await Campground.findByIdAndUpdate(
      id,
      req.body.campground,
      { new: true }
    );
    req.flash("success", "Succesfully updated campground!");
    res.redirect(`/campgrounds/${updatedCampground._id}`);
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", isLoggedIn, async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedCampground = await Campground.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted campground!");
    res.redirect("/campgrounds");
  } catch (err) {
    next(err);
  }
});

export default router;
