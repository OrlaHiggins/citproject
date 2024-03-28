const mongoose = require('mongoose');

const ProductDetailsSchema = new mongoose.Schema({
    product: String,
    description: String,
    category: String,
    price: Number,
    imageUrls: [String],
}, {
    collection: 'ProductInfo',
});

const ProductInfo = mongoose.model('ProductInfo', ProductDetailsSchema);

module.exports = ProductInfo;



