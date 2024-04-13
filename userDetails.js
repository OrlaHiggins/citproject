const mongoose = require("mongoose");

const UserDetailsSchema = new mongoose.Schema({
  fname: String,
  lname: String,
  email: { type: String, unique: true },
  password: String,
  userType: String,
  profilePicture: String,
},
{
  collection: "UserInfo",
});

module.exports = {
  UserDetails: mongoose.model('UserInfo', UserDetailsSchema),
};
