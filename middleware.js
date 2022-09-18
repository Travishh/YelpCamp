const ExpressError = require("./utils/ExpressError");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
      req.session.returnTo = req.originalUrl
      req.flash('error', 'You must be signed in first!');
      return res.redirect('/login');
  }
  next();
}

//validate campground form from server side
module.exports.validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((e) => e.message).join(", ");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

//validate review form from server side
module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body); //get the error from review's req.body(form)
  if (error) {
    //if there's an error
    const msg = error.details.map((e) => e.message).join(", ");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};