const mongoose = require("mongoose");
const Schema = mongoose.Schema; // set mongoose.Schema to Schema to shorten the code
const passportLocalMongoose = require("passport-local-mongoose");

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
});
UserSchema.plugin(passportLocalMongoose); // addOn Username(Unique) and password to schema

module.exports = mongoose.model("User", UserSchema);
