const mongoose = require('mongoose');

const listSchema = new mongoose.Schema({
  name: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'UserInfo' },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'ProductInfo' },
      title: String,
    },
  ],
});

const List = mongoose.model('List', listSchema);

module.exports = List;

