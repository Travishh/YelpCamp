const express = require("express");
const catchAsync = require("../utils/catchAsync");
const router = express.Router({ mergeParams: true }); //merge params from app.js
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');
const reviews = require('../controllers/reviews');

//Create a Review
router.post("/", 
    isLoggedIn, 
    validateReview, //validate Review form before sending request
    catchAsync(reviews.createReview)
);

//Delete a Review
router.delete("/:reviewId", 
    isLoggedIn, 
    isReviewAuthor, //middle to check if the author of the review
    catchAsync(reviews.deleteReview)
);

module.exports = router;
