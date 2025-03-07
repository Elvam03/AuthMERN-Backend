const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  firstName: { String },
  secondName: { String },
  email: { String  },
  password: { type: String },
  profileImage: { type: String },
  backgroundImage: { type: String }
});

module.exports = mongoose.model("User", UserSchema);
