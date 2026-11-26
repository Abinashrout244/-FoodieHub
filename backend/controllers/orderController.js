// const Order = require('../models/Order');
// const Cart = require('../models/Cart');

// // @desc    Place a new order
// // @route   POST /api/orders/place
// const placeOrder = async (req, res) => {
//   try {
//     const { items, totalAmount, address, paymentMethod } = req.body;

//     if (!items || items.length === 0) {
//       return res.status(400).json({ message: 'No items in order' });
//     }

//     if (!address || !address.street || !address.city || !address.state || !address.zipCode || !address.phone) {
//       return res.status(400).json({ message: 'Please provide complete delivery address' });
//     }

//     const order = await Order.create({
//       userId: req.user._id,
//       items,
//       totalAmount,
//       address,
//       paymentMethod: paymentMethod || 'cod',
//       status: 'Processing',
//     });

//     // Clear user's cart after order
//     await Cart.findOneAndDelete({ userId: req.user._id });

//     res.status(201).json(order);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // @desc    Get logged-in user's orders
// // @route   GET /api/orders/my-orders
// const getMyOrders = async (req, res) => {
//   try {
//     const orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 });
//     res.json(orders);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // @desc    Get all orders (admin)
// // @route   GET /api/orders/all
// const getAllOrders = async (req, res) => {
//   try {
//     const orders = await Order.find()
//       .populate('userId', 'name email')
//       .sort({ createdAt: -1 });
//     res.json(orders);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // @desc    Update order status (admin)
// // @route   PUT /api/orders/status/:id
// const updateOrderStatus = async (req, res) => {
//   try {
//     const { status } = req.body;
//     const order = await Order.findById(req.params.id);

//     if (!order) {
//       return res.status(404).json({ message: 'Order not found' });
//     }

//     order.status = status;
//     const updated = await order.save();
//     res.json(updated);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// module.exports = { placeOrder, getMyOrders, getAllOrders, updateOrderStatus };

const Order = require("../models/Order");
const Cart = require("../models/Cart");
const User = require("../models/User");
const Notification = require("../models/Notification");
const { getIO } = require("../config/socket");

// @desc    Place a new order
// @route   POST /api/orders/place
const placeOrder = async (req, res) => {
  try {
    const { items, totalAmount, address, paymentMethod } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No items in order" });
    }

    if (
      !address ||
      !address.street ||
      !address.city ||
      !address.state ||
      !address.zipCode ||
      !address.phone
    ) {
      return res.status(400).json({
        message: "Please provide complete delivery address",
      });
    }

    const order = await Order.create({
      userId: req.user._id,
      items,
      totalAmount,
      address,
      paymentMethod: paymentMethod || "cod",
      status: "Processing",
    });

    // Send the complete order to connected admins so their order list updates
    // without waiting for a reload. Populate the customer fields used by UI.
    const orderForAdmins = await Order.findById(order._id)
      .populate("userId", "name email")
      .lean();
    getIO().to("admins").emit("order:new", orderForAdmins);

    // Clear user's cart after order
    await Cart.findOneAndDelete({ userId: req.user._id });

    // Create notifications for all admins
    try {
      const admins = await User.find({ role: "admin" }).select("_id");

      if (admins.length > 0) {
        const notificationData = admins.map((admin) => ({
          userId: admin._id,
          title: "New Order Received",
          message: `A new order has been placed. Order ID: ${order._id}`,
          type: "order_placed",
          orderId: order._id,
        }));

        await Notification.insertMany(notificationData);

        // Notify connected admin clients in real time
        getIO().to("admins").emit("notification:new", {
          title: "New Order Received",
          message: "A new customer order has been placed.",
          type: "order_placed",
          orderId: order._id,
          createdAt: new Date(),
        });
      }
    } catch (notificationError) {
      console.error("Admin notification error:", notificationError.message);
    }

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged-in user's orders
// @route   GET /api/orders/my-orders
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      userId: req.user._id,
    }).sort({ createdAt: -1 });

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
      .populate("userId", "name email")
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
      return res.status(404).json({
        message: "Order not found",
      });
    }

    const previousStatus = order.status;

    order.status = status;

    const updated = await order.save();

    // Only notify when the status actually changes
    if (previousStatus !== updated.status) {
      try {
        // Save notification for the customer
        const notification = await Notification.create({
          userId: order.userId,
          title: "Order Status Updated",
          message: `Your order status is now ${updated.status}.`,
          type: "order_status",
          orderId: order._id,
        });

        // Notify the customer in real time
        getIO().to(`user:${order.userId}`).emit("notification:new", {
          _id: notification._id,
          title: notification.title,
          message: notification.message,
          type: notification.type,
          orderId: notification.orderId,
          isRead: false,
          createdAt: notification.createdAt,
        });
      } catch (notificationError) {
        console.error(
          "Customer notification error:",
          notificationError.message,
        );
      }
    }

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  placeOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
};
