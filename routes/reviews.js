const express = require("express");
const catchAsync = require("../utils/catchAsync");
const Review = require("../models/review");
const router = express.Router({ mergeParams: true }); //merge params from app.js
const Campground = require("../models/campground");
const { validateReview, isLoggedIn } = require('../middleware');




//Create a Review
router.post("/",
  isLoggedIn,
  validateReview, //validate Review form before sending request
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id); //get the campground from id
    const review = new Review(req.body.review); //create a new Review
    review.author = req.user._id;
    campground.reviews.push(review); //add the created review to campground review array
    await review.save(); //save
    await campground.save();
    req.flash("success", "Successfully Review!");
    res.redirect(`/campgrounds/${campground._id}`);
  })
);
//Delete a Review
//remove review reference in the campground and remove the review itself
router.delete("/:reviewId",
isLoggedIn,
catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    //remove reference from campground and then remove from the reviews
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } }); //find the campground and find & pull the review by reviewId from Campground
    await Review.findByIdAndDelete(reviewId); //delete review from reviews
    req.flash("success", "Successfully deleted review!");
    res.redirect(`/campgrounds/${id}`);
  })
);

module.exports = router;
