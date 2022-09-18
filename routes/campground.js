const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const Campground = require("../models/campground");
const { isLoggedIn, validateCampground } = require("../middleware");

//CRUD
//get all campgrounds
router.get('/', catchAsync(async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render('campgrounds/index', { campgrounds })
}));

//serving a form to create new campground
router.get('/new', isLoggedIn, (req, res) => {
  res.render('campgrounds/new');
})

//create campground
router.post('/', isLoggedIn, validateCampground, catchAsync(async (req, res, next) => {
  const campground = new Campground(req.body.campground);
  campground.author = req.user._id;
  await campground.save();
  req.flash('success', 'Successfully made a new campground!');
  res.redirect(`/campgrounds/${campground._id}`)
}))
//get ONE campgrounds
router.get('/:id', catchAsync(async (req, res,) => {
  const campground = await Campground.findById(req.params.id).populate({
      path: 'reviews',
      populate: {
          path: 'author'
      }
  }).populate('author');
  console.log(campground);
  if (!campground) {
      req.flash('error', 'Cannot find that campground!');
      return res.redirect('/campgrounds');
  }
  res.render('campgrounds/show', { campground });
}));

//serving edit form
router.get('/:id/edit', isLoggedIn, catchAsync(async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id)
  //prevent campground from passing to the ejs template if not found
  if (!campground) {
      req.flash('error', 'Cannot find that campground!');
      return res.redirect('/campgrounds');
  }
  res.render('campgrounds/edit', { campground });
}))
//edit campground
router.put('/:id', isLoggedIn, validateCampground, catchAsync(async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
  req.flash('success', 'Successfully updated campground!');
  res.redirect(`/campgrounds/${campground._id}`)
}));

//delete campground
router.delete('/:id', isLoggedIn, catchAsync(async (req, res) => {
  const { id } = req.params;
  await Campground.findByIdAndDelete(id);
  req.flash('success', 'Successfully deleted campground')
  res.redirect('/campgrounds');
}));

module.exports = router;
