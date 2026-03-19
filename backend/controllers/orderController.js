const Order = require('../models/Order');
const Cart = require('../models/Cart');

// @desc    Place a new order
// @route   POST /api/orders/place
const placeOrder = async (req, res) => {
  try {
    const { items, totalAmount, address, paymentMethod } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No items in order' });
    }

    if (!address || !address.street || !address.city || !address.state || !address.zipCode || !address.phone) {
      return res.status(400).json({ message: 'Please provide complete delivery address' });
    }

    const order = await Order.create({
      userId: req.user._id,
      items,
      totalAmount,
      address,
      paymentMethod: paymentMethod || 'cod',
      status: 'Processing',
    });

    // Clear user's cart after order
    await Cart.findOneAndDelete({ userId: req.user._id });

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged-in user's orders
// @route   GET /api/orders/my-orders
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all orders (admin)
// @route   GET /api/orders/all
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update order status (admin)
// @route   PUT /api/orders/status/:id
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = status;
    const updated = await order.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { placeOrder, getMyOrders, getAllOrders, updateOrderStatus };
