const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');
const campgrounds = require('../controllers/campgrounds')
const multer = require('multer') //middleware parse enctype multipart form (file upload)
const {storage} = require('../cloudinary/index')
const upload = multer({storage})

//CRUD
//Refactor code using router.route

router.route('/') //chaining all routes that use '/' path
    //get all campgrounds
    .get(catchAsync(campgrounds.index))
    //create campground
    // .post(isLoggedIn, validateCampground, catchAsync(campgrounds.createCampground))
    .post(upload.single('image'),(req,res)=>{
        console.log(req.body, req.file);
        res.send('worked')
    })
//serving a form to create new campground
router.get('/new', isLoggedIn, campgrounds.renderNewForm )

router.route('/:id') //chaining all routes that use '/:id' path
    //get ONE campgrounds
    .get(catchAsync(campgrounds.getOneCampground))
    //edit campground
    .put(isLoggedIn, isAuthor, validateCampground, catchAsync(campgrounds.updateCampground))
    //delete campground
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));

//serving edit form
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm))




module.exports = router;