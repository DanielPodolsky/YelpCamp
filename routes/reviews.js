import { Router } from "express";
import { isLoggedIn, validateReview, isReviewAuthor } from "../middleware.js";
import { createReview, deleteReview } from "../controllers/reviews.js";

const router = Router({ mergeParams: true });

router.post("/", isLoggedIn, validateReview, createReview);

router.delete("/:reviewId", isLoggedIn, isReviewAuthor, deleteReview);

export default router;
