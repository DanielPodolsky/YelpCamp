import { Router } from "express";
import Campground from "../models/campground.js";
import Review from "../models/review.js";
import { isLoggedIn, validateReview, isReviewAuthor } from "../middleware.js";

const router = Router({ mergeParams: true });

router.post("/", isLoggedIn, validateReview, async (req, res) => {
  const id = req.params.id;
  const campground = await Campground.findById(id);
  const review = new Review(req.body.review);
  review.author = req.user._id;
  campground.reviews.push(review);
  await review.save();
  await campground.save();
  req.flash("success", "Successfully created new review!");
  res.redirect(`/campgrounds/${id}`);
});

router.delete("/:reviewId", isLoggedIn, isReviewAuthor, async (req, res) => {
  try {
    const { id, reviewId } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {
      $pull: {
        reviews: reviewId,
      },
    });
    const review = await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Successfully deleted review!");
    res.redirect(`/campgrounds/${id}`);
  } catch (err) {
    next(err);
  }
});

export default router;
