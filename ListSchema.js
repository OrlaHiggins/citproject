const mongoose = require('mongoose');

const ListSchema = new mongoose.Schema({
  name: String,
  userId: mongoose.Schema.Types.ObjectId,
  items: [
    {
      productId: mongoose.Schema.Types.ObjectId,
      title: String,
      price: Number,
    },
  ],
  totalPrice: Number,
});

const List = mongoose.model('List', ListSchema); // Fixed typo here

module.exports = List;


