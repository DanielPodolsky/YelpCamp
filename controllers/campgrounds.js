import Campground from "../models/campground.js";

export const index = async (req, res, next) => {
  try {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
  } catch (err) {
    next(err);
  }
};

export const renderNewForm = (req, res, next) => {
  res.render("campgrounds/new");
};

export const createCampground = async (req, res, next) => {
  try {
    // if (!req.body.campground) {
    //   throw new ExpressError("Invalid Campground Data", 400);
    // }
    const newCampground = new Campground({ ...req.body.campground });
    newCampground.author = req.user._id;
    await newCampground.save();
    req.flash("success", "Succesfully made a new campground!");
    res.redirect(`/campgrounds/${newCampground._id}`);
  } catch (err) {
    next(err);
  }
};

export const showCampground = async (req, res, next) => {
  try {
    const { id } = req.params;
    const campground = await Campground.findById(id)
      .populate({
        path: "reviews",
        populate: {
          path: "author",
        },
      })
      .populate("author");
    if (!campground) {
      req.flash("error", "Cannot find campground");
      return res.redirect("/campgrounds");
    }
    res.render("campgrounds/show", { campground });
  } catch (err) {
    next(err);
  }
};

export const renderEditForm = async (req, res, next) => {
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
};

export const updateCampground = async (req, res, next) => {
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
};

export const deleteCampground = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedCampground = await Campground.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted campground!");
    res.redirect("/campgrounds");
  } catch (err) {
    next(err);
  }
};
