const mongoose = require('mongoose');

const ProductDetailsSchema = new mongoose.Schema({
  product: String,
  description: String,
  category: String,
  price: Number,
  imageUrls: [String],
  websiteLink: String,
  storeId: String, // Add the storeId field
  updatedAt: { type: Date, default: Date.now },
}, {
  collection: 'ProductInfo',
});

const ProductInfo = mongoose.model('ProductInfo', ProductDetailsSchema);
module.exports = ProductInfo;



