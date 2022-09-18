const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');
const reviews = require('../controllers/users')

router.route('/register') //chaining all routes with '/register' path
    .get(reviews.renderRegisterForm)
    .post(catchAsync(reviews.createUser));

router.route('/login') //chaining all routes with '/login' path
    .get(reviews.renderLoginForm)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), reviews.userLogin)

router.get('/logout', reviews.userLogout)

module.exports = router;