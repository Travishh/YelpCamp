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
  for (let i = 0; i < 300; i++) {
    const randCity = Math.floor(Math.random() * 350);
    const price = Math.floor(Math.random() * 20) + 10;
    const camps = new Campground({
      author: "63267f2bb8c127d5be7aab87",
      location: `${cities[randCity].city}, ${cities[randCity].admin_name}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis euismod diam eget arcu bibendum, quis ullamcorper nunc sodales. Nunc eleifend mi quis est venenatis pulvinar. Duis ut consectetur ipsum. Quisque ultrices arcu eget arcu accumsan, a molestie purus volutpat.",
      price,
      geometry: { 
        type: 'Point', 
        coordinates: [
          cities[randCity].lng,
          cities[randCity].lat,
      ] 
      },
      images: [
        {
          url: 'https://res.cloudinary.com/dtgnkaod2/image/upload/v1663491947/YelpCamp/crjvnoxd8rtv4n6eetob.jpg',
          filename: 'YelpCamp/ygjzcqxnijivmkn7vyfq',
        }
      ]
    });
    await camps.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
