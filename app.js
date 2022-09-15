const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const Campground = require("./models/campground");
const methodOverride = require("method-override"); //to access method other than get, put in ejs
const ejsMate = require("ejs-mate");
const catchAsync = require("./utils/catchAsync");
const ExpressError = require("./utils/ExpressError");
const { campgroundSchema } = require("./schemas");
const { reviewSchema } = require("./schemas"); //Joi Schema for schema validation
const Review = require("./models/review");
//connect to mongoDB
mongoose
  .connect("mongodb://localhost:27017/yelp-camp")
  .then(() => {
    console.log("MONGODB CONNECTED!!!");
  })
  .catch((err) => {
    console.log(`Connection Error!!! ${err}`);
  });

//middleware
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res) => {
  res.render("home");
});
//parse form data
app.use(express.urlencoded({ extended: true }));
//override post method in form to use PUT, DELETE...
app.use(methodOverride("_method"));

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

//CRUD
//get all campgrounds
app.get(
  "/campgrounds",
  catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
  })
);
//serving a form to create new campground
app.get("/campgrounds/new", (req, res) => {
  res.render("campgrounds/new");
});
//get ONE campgrounds
app.get(
  "/campgrounds/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate("reviews");
    res.render("campgrounds/show", { campground });
  })
);
//create campground
app.post(
  "/campgrounds",
  validateCampground,
  catchAsync(async (req, res) => {
    // if (!req.body.campground) throw new ExpressError("Invalid Input", 400);
    const newCampground = new Campground(req.body.campground);
    await newCampground.save();
    res.redirect(`/campgrounds/${newCampground._id}`);
  })
);
//serving edit form
app.get(
  "/campgrounds/:id/edit",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    res.render("campgrounds/edit", { campground });
  })
);
//edit campground
app.put(
  "/campgrounds/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const foundCampground = await Campground.findByIdAndUpdate(id, {
      ...req.body.campground,
    });
    res.redirect(`/campgrounds/${foundCampground._id}`);
  })
);

//delete campground
app.delete(
  "/campgrounds/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const deleteCampground = await Campground.findByIdAndDelete(id);
    res.redirect(`/campgrounds`);
  })
);

//Create a Review
app.post(
  "/campgrounds/:id/reviews",
  validateReview, //validate Review form before sending request
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id); //get the campground from id
    const review = new Review(req.body.review); //create a new Review
    campground.reviews.push(review); //add the created review to campground review array
    await review.save(); //save
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
  })
);
//Delete a Review
app.delete(
  //remove review reference in the campground and remove the review itself
  "/campgrounds/:id/reviews/:reviewId",
  catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    //remove reference from campground and then remove from the reviews
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } }); //find the campground and find & pull the review by reviewId from Campground
    await Review.findByIdAndDelete(reviewId); //delete review from reviews
    res.redirect(`/campgrounds/${id}`);
  })
);

//any routes that not match above routes redirect to 404 not found
app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});
//Express middleware error handlers
app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Something Went Wrong!";
  res.status(statusCode).render("error", { err });
});

app.listen(3000, () => {
  console.log("Listening on Port 3000!!");
});
