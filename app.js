const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override"); //to access method other than get, put in ejs
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");
const reviewRoute = require("./routes/reviews");
const campgroundRoute = require("./routes/campground");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");
const usersRoute = require("./routes/users");

//connect to mongoDB
mongoose
  .connect("mongodb://localhost:27017/yelp-camp")
  .then(() => {
    console.log("MONGODB CONNECTED!!!");
  })
  .catch((err) => {
    console.log(`Connection Error!!! ${err}`);
  });

//MIDDLEWARE
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true })); //parse form data
app.use(methodOverride("_method")); //override post method in form to use PUT, DELETE...
//Serve Static files/assets from public dir
app.use(express.static(path.join(__dirname, "public")));

const sessionConfig = {
  secret: "thisshouldbeabettersecret",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7, //cookie life span of 1 week
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};
app.use(session(sessionConfig)); //set up session
app.use(flash()); //use flash

//Authentication using Passport js
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser()); // how to store the user in the session
passport.deserializeUser(User.deserializeUser()); // how to unstore the user in the session

//middleware to retrieve messages from flash
app.use((req, res, next) => {
  // console.log(req.session);
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});
//Use Routes
app.get("/", (req, res) => {
  res.render("home");
});
app.use("/", usersRoute);
app.use("/campgrounds", campgroundRoute);
app.use("/campgrounds/:id/reviews", reviewRoute);

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
