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
    const price = Math.floor(Math.random() * 20) + 10;
    const camps = new Campground({
      location: `${cities[randCity].city}, ${cities[randCity].admin_name}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      image:
        "https://images.unsplash.com/photo-1518602164578-cd0074062767?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=550&q=550",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis euismod diam eget arcu bibendum, quis ullamcorper nunc sodales. Nunc eleifend mi quis est venenatis pulvinar. Duis ut consectetur ipsum. Quisque ultrices arcu eget arcu accumsan, a molestie purus volutpat.",
      price,
    });
    await camps.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
