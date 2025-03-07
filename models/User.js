const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  firstName: { String, required: true },
  secondName: { String, required: true },
  email: { String, required: true },
  password: { type: String, required: true },
  profileImage: { type: String },
  backgroundImage: { type: String }
});

module.exports = mongoose.model("User", UserSchema);
