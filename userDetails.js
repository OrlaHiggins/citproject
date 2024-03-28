const mongoose = require("mongoose");

const UserDetailsSchema = new mongoose.Schema({
  fname: String,
  lname: String,
  email: { type: String, unique: true },
  password: String,
  userType: String
},
{
  collection: "UserInfo",
});

module.exports = {
  UserDetails: mongoose.model('UserInfo', UserDetailsSchema),
};

// const mongoose = require("mongoose");

// // User details schema
// const UserDetailsSchema = new mongoose.Schema({
//   name: String,
//   email: { type: String, unique: true },
//   password: String,
//   userType: String
// },
// {
//   collection: "UserInfo",
// });

// // Product schema
// const productSchema = new mongoose.Schema({
//   title: String,
//   description: String,
//   price: Number,
//   category: String,
//   imagePath: String
// });

// module.exports = {
//   UserDetails: mongoose.model('UserInfo', UserDetailsSchema),
//   Product: mongoose.model('Product', productSchema), // Add Product schema export
// };


// const mongoose = require("mongoose");

// const UserDetailsScehma = new mongoose.Schema(
//   {
//     name: String,
//     email: { type: String, unique: true },
//     password: String,
//     userType: String,
//   },
//   {
//     collection: "UserInfo",
//   }
// );

// mongoose.model("UserInfo", UserDetailsScehma);
