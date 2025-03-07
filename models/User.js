const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  secondName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  age: { type: String },
  phone: { type: String },
  location: { type: String },
  profileImage: { type: String },
  backgroundImage: { type: String }
});

module.exports = mongoose.model("User", UserSchema);
