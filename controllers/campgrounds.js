import Campground from "../models/campground.js";
import { cloudinary } from "../cloudinary/index.js";
import * as maptilerClient from "@maptiler/client";

maptilerClient.config.apiKey = process.env.MAPTILER_API_KEY;

export const index = async (req, res, next) => {
  try {
    // Pagination settings
    const page = parseInt(req.query.page) || 1;
    const limit = 12;
    const skip = (page - 1) * limit;

    // Get total count
    const totalCampgrounds = await Campground.countDocuments();
    const totalPages = Math.ceil(totalCampgrounds / limit);

    // Get paginated campgrounds
    const campgrounds = await Campground.find({})
      .skip(skip)
      .limit(limit)
      .sort({ _id: -1 });

    // Get all campgrounds for map
    const allCampgrounds = await Campground.find({});

    // Create GeoJSON for the cluster map
    const campgroundsGeoJSON = {
      type: "FeatureCollection",
      features: allCampgrounds.map((campground) => ({
        type: "Feature",
        geometry: campground.geometry,
        properties: {
          popUpMarkup: `
            <strong><a href="/campgrounds/${campground._id}">${
            campground.title
          }</a></strong>
            <p>${
              campground.description
                ? campground.description.substring(0, 50) + "..."
                : ""
            }</p>
          `,
        },
      })),
    };

    // Calculate pagination display logic
    let startPage = Math.max(1, page - 2);
    let endPage = Math.min(totalPages, page + 2);

    if (page <= 3) {
      endPage = Math.min(5, totalPages);
    }
    if (page > totalPages - 3) {
      startPage = Math.max(1, totalPages - 4);
    }

    res.render("campgrounds/index", {
      campgrounds,
      campgroundsGeoJSON,
      currentPage: page,
      totalPages,
      totalCampgrounds,
      startPage,
      endPage,
    });
  } catch (err) {
    next(err);
  }
};

export const renderNewForm = (req, res, next) => {
  res.render("campgrounds/new");
};

export const createCampground = async (req, res, next) => {
  try {
    const geoData = await maptilerClient.geocoding.forward(
      req.body.campground.location,
      { limit: 1 }
    );
    console.log(geoData);
    if (!geoData.features?.length) {
      req.flash(
        "error",
        "Could not geocode that location. Please try again and enter a valid location."
      );
      return res.redirect("/campgrounds/new");
    }
    const newCampground = new Campground({ ...req.body.campground });
    newCampground.geometry = geoData.features[0].geometry;
    newCampground.location = geoData.features[0].place_name;
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

    // Create a clean object for the map with only necessary data
    const campgroundForMap = {
      _id: campground._id,
      title: campground.title,
      location: campground.location,
      geometry: campground.geometry,
    };

    res.render("campgrounds/show", { campground, campgroundForMap });
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

    const geoData = await maptilerClient.geocoding.forward(
      req.body.campground.location,
      { limit: 1 }
    );
    if (!geoData.features?.length) {
      req.flash(
        "error",
        "Could not geocode that location. Please try again and enter a valid location."
      );
      return res.redirect("/campgrounds/new");
    }

    const images = req.files.map((f) => ({
      url: f.path,
      filename: f.filename,
    }));
    const updatedCampground = await Campground.findByIdAndUpdate(
      id,
      req.body.campground,
      { new: true }
    );

    updatedCampground.geometry = geoData.features[0].geometry;
    updatedCampground.location = geoData.features[0].place_name;

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
