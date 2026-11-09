const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  name:           { type: String, required: true, trim: true },
  price:          { type: Number, required: true, min: 0 },
  description:    { type: String, default: '' },
  image:          { type: String, default: '' },
  category:       { type: String, required: true },
  isVeg:          { type: Boolean, default: false },
  isBestseller:   { type: Boolean, default: false },
  isCustomizable: { type: Boolean, default: false },
  rating:         { type: Number, default: 4.0 },
  reviews:        { type: Number, default: 0 },
});

const menuSectionSchema = new mongoose.Schema({
  category: { type: String, required: true },
  items:    [menuItemSchema],
});

const restaurantSchema = new mongoose.Schema({
  name:         { type: String, required: true, trim: true },
  image:        { type: String, required: true },
  cuisines:     [{ type: String }],
  rating:       { type: Number, default: 4.0 },
  totalRatings: { type: String, default: '0' },
  deliveryTime: { type: String, default: '30-35' },
  minOrder:     { type: Number, default: 0 },
  deliveryFee:  { type: Number, default: 0 },
  offer:        { type: String, default: '' },
  isOpen:       { type: Boolean, default: true },
  location:     { type: String, default: '' },
  tags:         [{ type: String }],
  priceForTwo:  { type: Number, default: 500 },
  menu:         [menuSectionSchema],
}, { timestamps: true });

module.exports = mongoose.model('Restaurant', restaurantSchema);
