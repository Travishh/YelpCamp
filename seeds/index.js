const mongoose = require("mongoose");
const Campground = require("../models/campground");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelper");

mongoose
  .connect("mongodb://localhost:27017/yelp-camp")
  .then(() => {
    console.log("MONGODB CONNECTED!!!");
  })
  .catch((err) => {
    console.log(`Connection Error!!! ${err}`);
  });

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 50; i++) {
    const randCity = Math.floor(Math.random() * 350);
    const camps = new Campground({
      location: `${cities[randCity].city}, ${cities[randCity].admin_name}`,
      title: `${sample(descriptors)} ${sample(places)}`,
    });
    await camps.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
