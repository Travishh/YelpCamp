const mongoose = require("mongoose");
const Schema = mongoose.Schema; // set mongoose.Schema to Schema to shorten the code

const reviewSchema = new Schema({
  body: String,
  rating: Number,
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("Review", reviewSchema);
