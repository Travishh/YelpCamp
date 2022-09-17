const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const Campground = require("../models/campground");
const { campgroundSchema } = require("../schemas");
const { response } = require("express");
const { isLoggedIn } = require("../middleware");

//validate campground form from server side
const validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((e) => e.message).join(", ");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

//CRUD
//get all campgrounds
router.get(
  "/",
  catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
  })
);
//serving a form to create new campground
router.get("/new", isLoggedIn, (req, res) => {
  res.render("campgrounds/new");
});
//get ONE campgrounds
router.get(
  "/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate("reviews");
    //prevent campground from passing to the ejs template if not found
    if (!campground) {
      req.flash("error", "Cannot Find Campground!");
      return res.redirect("/campgrounds");
    }
    res.render("campgrounds/show", { campground });
  })
);
//create campground
router.post(
  "/",
  isLoggedIn,
  validateCampground,
  catchAsync(async (req, res) => {
    // if (!req.body.campground) throw new ExpressError("Invalid Input", 400);
    const newCampground = new Campground(req.body.campground);
    await newCampground.save();
    req.flash("success", "Successfully made a new Campground!");
    res.redirect(`/campgrounds/${newCampground._id}`);
  })
);
//serving edit form
router.get(
  "/:id/edit",
  isLoggedIn,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    //prevent campground from passing to the ejs template if not found
    if (!campground) {
      req.flash("error", "Cannot Find Campground!");
      return res.redirect("/campgrounds");
    }
    res.render("campgrounds/edit", { campground });
  })
);
//edit campground
router.put(
  "/:id",
  isLoggedIn,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const foundCampground = await Campground.findByIdAndUpdate(id, {
      ...req.body.campground,
    });
    req.flash("success", "Successfully Updated Campground!");
    res.redirect(`/campgrounds/${foundCampground._id}`);
  })
);

//delete campground
router.delete(
  "/:id",
  isLoggedIn,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const deleteCampground = await Campground.findByIdAndDelete(id);
    req.flash("success", "Successfully Deleted campground!");
    res.redirect(`/campgrounds`);
  })
);

module.exports = router;
