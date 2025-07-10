const express = require("express");
const router = express.Router({ mergeParams: true }); //merged params is used because ID is passed by app.js to review.js in the URL, 
// so app = parent and review = child, to dono ke parameters ko merge krne ke liye mergeParams = true karke pass krte he

const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

const wrapAsync = require("../utils/wrapAsync.js");

const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware.js");

const reviewController = require("../controllers/reviews.js");
const review = require("../models/review.js");
//reviews - POST route
router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(reviewController.createReview)
);

//Reviews - delete review route
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(reviewController.deleteReview)
);

module.exports = router;
