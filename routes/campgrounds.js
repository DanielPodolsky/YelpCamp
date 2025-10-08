import { Router } from "express";
import Campground from "../models/campground.js";
import { isLoggedIn, isAuthor, validateCampground } from "../middleware.js";
import {
  index,
  renderNewForm,
  createCampground,
  showCampground,
  renderEditForm,
  updateCampground,
  deleteCampground,
} from "../controllers/campgrounds.js";
import multer from "multer";
import { cloudinary, storage } from "../cloudinary/index.js";

const router = Router();
const upload = multer({ storage });

router.get("/new", isLoggedIn, renderNewForm);

router
  .route("/")
  .get(index)
  .post(
    isLoggedIn,
    upload.array("campground[image]"),
    validateCampground,
    createCampground
  );

router
  .route("/:id")
  .get(showCampground)
  .put(isLoggedIn, isAuthor, validateCampground, updateCampground)
  .delete(isLoggedIn, isAuthor, deleteCampground);

router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  validateCampground,
  renderEditForm
);

export default router;
