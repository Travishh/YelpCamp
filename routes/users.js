const expres = require("express");
const passport = require("passport");
const router = expres.Router();
const User = require("../models/user");
const catchAsync = require("../utils/catchAsync");

router.get("/register", (req, res) => {
  res.render("users/register");
});
router.post("/register", catchAsync(async (req, res, next) => {
    try {
      const { email, username, password } = req.body;
      const user = new User({ email, username });
      const registeredUser = await User.register(user, password);
      //When Successfully create a new user, auto login in that user
      req.login(registeredUser, (err) => {
        if (err) return next(err);
        req.flash("success", "Welcome to Yelp Camp!");
        res.redirect("/campgrounds");
      });
    } catch (error) {
      req.flash("error", error.message);
      res.redirect("register");
    }
  })
);

router.get("/login", (req, res) => {
  res.render("users/login");
});
router.post("/login",
  passport.authenticate("local", {failureFlash: true, failureRedirect: "/login"}), (req, res) => {
    req.flash("success", "welcome back!");
    const redirectUrl = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
  }
);

router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) return next(err);
    req.flash("success", "Logged Out!");
    res.redirect("/campgrounds");
  });
});

module.exports = router;
