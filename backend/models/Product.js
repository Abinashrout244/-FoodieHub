const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
  },
  image: {
    type: String,
    required: [true, 'Product image is required'],
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Salad', 'Pizza', 'Burger', 'Pasta', 'Dessert', 'Drinks', 'Sandwich', 'Biryani'],
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: 0,
  },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
