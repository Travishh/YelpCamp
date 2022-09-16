const express = require("express");
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const { reviewSchema } = require("../schemas"); //Joi Schema for schema validation
const Review = require("../models/review");
const router = express.Router({ mergeParams: true }); //merge params from app.js
const Campground = require("../models/campground");

//validate review form from server side
const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body); //get the error from review's req.body(form)
  if (error) {
    //if there's an error
    const msg = error.details.map((e) => e.message).join(", ");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

//Create a Review
router.post(
  "/",
  validateReview, //validate Review form before sending request
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id); //get the campground from id
    const review = new Review(req.body.review); //create a new Review
    campground.reviews.push(review); //add the created review to campground review array
    await review.save(); //save
    await campground.save();
    req.flash("success", "Successfully Review!");
    res.redirect(`/campgrounds/${campground._id}`);
  })
);
//Delete a Review
router.delete(
  //remove review reference in the campground and remove the review itself
  "/:reviewId",
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
