const mongoose = require('mongoose');

const ListSchema = new mongoose.Schema({
  name: String,
  userId: mongoose.Schema.Types.ObjectId,
  userType: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  items: [
    {
      productId: mongoose.Schema.Types.ObjectId,
      title: String,
      price: Number,
    },
  ],
  totalPrice: Number,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const List = mongoose.model('List', ListSchema);

module.exports = List;
