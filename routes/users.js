const expres = require("express");
const passport = require("passport");
const router = expres.Router();
const User = require("../models/user");
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");

router.get("/register", (req, res) => {
  res.render("users/register");
});
router.post(
  "/register",
  catchAsync(async (req, res) => {
    try {
      const { email, username, password } = req.body;
      const user = new User({ email, username });
      const registeredUser = await User.register(user, password);
      req.flash("success", "Welcome to Yelp Camp!");
      res.redirect("/campgrounds");
    } catch (error) {
      req.flash("error", error.message);
      res.redirect("register");
    }
  })
);

router.get("/login", (req, res) => {
  res.render("users/login");
});
router.post(
  "/login",
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  (req, res) => {
    req.flash("success", "Welcome Back");
    res.redirect("/campgrounds");
  }
);

router.get("/logout", (req, res) => {
  req.logOut();
  req.flash("success", "Logged Out!");
  res.redirect("/campgrounds");
});

module.exports = router;
