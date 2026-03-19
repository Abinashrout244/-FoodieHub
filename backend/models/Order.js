const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      },
      name: String,
      image: String,
      price: Number,
      quantity: Number,
    },
  ],
  totalAmount: {
    type: Number,
    required: true,
  },
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    phone: { type: String, required: true },
  },
  paymentMethod: {
    type: String,
    enum: ['cod', 'online'],
    default: 'cod',
  },
  status: {
    type: String,
    enum: ['Processing', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'],
    default: 'Processing',
  },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
