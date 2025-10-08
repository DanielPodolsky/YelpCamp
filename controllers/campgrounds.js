import Campground from "../models/campground.js";
import { cloudinary } from "../cloudinary/index.js";

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
    const newCampground = new Campground({ ...req.body.campground });
    newCampground.author = req.user._id;
    newCampground.images = req.files.map((f) => ({
      url: f.path,
      filename: f.filename,
    }));
    await newCampground.save();
    console.log(newCampground);
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
    console.log(req.body);
    const images = req.files.map((f) => ({
      url: f.path,
      filename: f.filename,
    }));
    const updatedCampground = await Campground.findByIdAndUpdate(
      id,
      req.body.campground,
      { new: true }
    );
    updatedCampground.images.push(...images);

    if (req.body.deleteImages) {
      // Remove from MongoDB
      await updatedCampground.updateOne({
        $pull: {
          images: {
            filename: {
              $in: req.body.deleteImages,
            },
          },
        },
      });

      // Remove from Cloudinary
      for (let filename of req.body.deleteImages) {
        await cloudinary.uploader.destroy(filename);
      }
    }
    await updatedCampground.save();
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
