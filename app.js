if(process.env.NODE_ENV !== "production"){ //if not in production, get the env variables
    require('dotenv').config();
}


const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override"); //to access method other than get, put in ejs
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");
const mongoSanitize = require('express-mongo-sanitize');
const MongoStore = require('connect-mongo');

const usersRoute = require("./routes/users");
const reviewRoute = require("./routes/reviews");
const campgroundRoute = require("./routes/campground");

// const dbUrl = process.env.DB_URL;
const dbUrl = "mongodb://localhost:27017/yelp-camp";
//connect to mongoDB

mongoose
  .connect(dbUrl)
  .then(() => {
    console.log("MONGODB CONNECTED!!!");
  })
  .catch((err) => {
    console.log(`Connection Error!!! ${err}`);
  });

//MIDDLEWARE
app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')))

const sessionConfig = {
    store: MongoStore.create({mongoUrl: dbUrl}), //use mongo to store session rather than local storage
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7, //cookie life span of 1 week
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig))//set up session
app.use(flash());//use flash

//Authentication using Passport js
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser()); // how to store the user in the session
passport.deserializeUser(User.deserializeUser()); // how to unstore the user in the session

app.use((req, res, next) => {
    // console.log(req.session)
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})
app.use(mongoSanitize()); // prevent mongo injection

//Use Routes
app.use('/', usersRoute);
app.use('/campgrounds', campgroundRoute)
app.use('/campgrounds/:id/reviews', reviewRoute)


app.get('/', (req, res) => {
    res.render('home')
});

//any routes that not match above routes redirect to 404 not found
app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

//Express middleware error handlers
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', { err })
})

app.listen(3000, () => {
    console.log('Serving on port 3000')
})
