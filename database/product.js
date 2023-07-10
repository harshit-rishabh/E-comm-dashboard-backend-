const mongoose = require('mongoose');
const ProductSchema = new mongoose.Schema({
    name: String,
    price: String,
    category: String,
    userId: String,
    company: String
}, { collection: 'product' });
module.exports = mongoose.model('product', ProductSchema);