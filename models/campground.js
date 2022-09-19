const { ref } = require("joi");
const mongoose = require("mongoose");
const Review = require("./review");
const Schema = mongoose.Schema;
const opts = {toJSON: {virtuals: true}}; //include virtual when convert to json

const ImageSchema = new Schema({
  url: String,
  filename: String,
});
ImageSchema.virtual('thumbnail').get(function(){ 
  //create a virtual for each image to replace the url and display it in edit.js
  return this.url.replace('/upload', '/upload/w_200')
})

const CampgroundSchema = new Schema({
  title: String,
  images: [ImageSchema],
  geometry: {
    type: {
      type: String,
      enum: ['Point'], //type must be set to Point
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }

  },
  price: Number,
  description: String,
  location: String,
  author: {
    //connect to user model to associate user with campground
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  reviews: [
    //connect review model to campground
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
}, opts);

CampgroundSchema.virtual('properties.popUpMarkup').get(function(){ 
  //create a virtual, have a properties popUpMarkup field in it for clusterMap mapbox access
  return `<strong><a href='/campgrounds/${this._id}'>${this.title}</a></strong>
          <p>${this.description.substring(0, 25)}...</p>` //display the text in description 20 characters
})

//mongoose query middleware to delete all associated reviews when campground is deleted
CampgroundSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    //something is found and deleted
    await Review.deleteMany({
      //delete all reviews where their id is in the doc that was deleted
      _id: {
        $in: doc.reviews,
      },
    });
  }
});

module.exports = mongoose.model("Campground", CampgroundSchema);
