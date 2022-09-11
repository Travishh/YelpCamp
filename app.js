const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const Campground = require("./models/campground");
const methodOverride = require("method-override");

mongoose
  .connect("mongodb://localhost:27017/yelp-camp")
  .then(() => {
    console.log("MONGODB CONNECTED!!!");
  })
  .catch((err) => {
    console.log(`Connection Error!!! ${err}`);
  });

//middleware
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res) => {
  res.render("home");
});
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

//get all campgrounds
app.get("/campgrounds", async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index", { campgrounds });
});
//serving a form to create new campground
app.get("/campgrounds/new", (req, res) => {
  res.render("campgrounds/new");
});
//get ONE campgrounds
app.get("/campgrounds/:id", async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  res.render("campgrounds/show", { campground });
});
//create campground
app.post("/campgrounds", async (req, res) => {
  const newCampground = new Campground(req.body.campground);
  await newCampground.save();
  res.redirect(`/campgrounds/${newCampground._id}`);
});
//serving edit form
app.get("/campgrounds/:id/edit", async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  res.render("campgrounds/edit", { campground });
});
//edit campground
app.put("/campgrounds/:id", async (req, res) => {
  const { id } = req.params;
  const foundCampground = await Campground.findByIdAndUpdate(id, {
    ...req.body.campground,
  });
  res.redirect(`/campgrounds/${foundCampground._id}`);
});

//delete campground
app.delete("/campgrounds/:id", async (req, res) => {
  const { id } = req.params;
  const deleteCampground = await Campground.findByIdAndDelete(id);
  res.redirect(`/campgrounds`);
});

app.listen(3000, () => {
  console.log("Listening on Port 3000!!");
});
