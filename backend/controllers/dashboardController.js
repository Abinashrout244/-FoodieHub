const Order = require("../models/Order");
const Product = require("../models/Product");
const User = require("../models/User");

// Get admin dashboard statistics
const getDashboardStats = async (req, res) => {
  try {
    const now = new Date();

    // Current 7-day period and previous 7-day period
    const today = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
    );

    const currentStart = new Date(today);
    currentStart.setUTCDate(currentStart.getUTCDate() - 6);

    const previousStart = new Date(currentStart);
    previousStart.setUTCDate(previousStart.getUTCDate() - 7);

    const getPercentageChange = (current, previous) => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return Number((((current - previous) / previous) * 100).toFixed(1));
    };

    // All-time statistics
    const [
      revenueResult,
      totalOrders,
      totalProducts,
      totalCustomers,
      weeklyOrders,
      recentOrders,
    ] = await Promise.all([
      // Revenue from delivered orders only
      Order.aggregate([
        { $match: { status: "Delivered" } },
        {
          $group: {
            _id: null,
            total: { $sum: "$totalAmount" },
          },
        },
      ]),

      Order.countDocuments(),

      Product.countDocuments(),

      User.countDocuments(),

      // Orders and delivered revenue for the last 14 days
      Order.aggregate([
        {
          $match: {
            createdAt: {
              $gte: previousStart,
              $lt: new Date(today.getTime() + 86400000),
            },
          },
        },
        {
          $group: {
            _id: {
              $dateToString: {
                format: "%Y-%m-%d",
                date: "$createdAt",
              },
            },
            orders: { $sum: 1 },
            revenue: {
              $sum: {
                $cond: [{ $eq: ["$status", "Delivered"] }, "$totalAmount", 0],
              },
            },
          },
        },
        { $sort: { _id: 1 } },
      ]),

      // Latest five orders
      Order.find()
        .populate("userId", "name email")
        .sort({ createdAt: -1 })
        .limit(5)
        .lean(),
    ]);

    // Build the seven-day revenue chart
    const weeklyMap = new Map(weeklyOrders.map((item) => [item._id, item]));

    const revenueData = [];

    for (let i = 0; i < 7; i++) {
      const date = new Date(currentStart);
      date.setUTCDate(date.getUTCDate() + i);

      const key = date.toISOString().slice(0, 10);
      const data = weeklyMap.get(key);

      revenueData.push({
        day: date.toLocaleDateString("en-US", {
          weekday: "short",
          timeZone: "UTC",
        }),
        revenue: data?.revenue || 0,
        orders: data?.orders || 0,
      });
    }

    // Calculate weekly revenue and order changes
    const currentWeek = weeklyOrders.filter(
      (item) => item._id >= currentStart.toISOString().slice(0, 10),
    );

    const previousWeek = weeklyOrders.filter(
      (item) => item._id < currentStart.toISOString().slice(0, 10),
    );

    const currentRevenue = currentWeek.reduce(
      (sum, item) => sum + item.revenue,
      0,
    );

    const previousRevenue = previousWeek.reduce(
      (sum, item) => sum + item.revenue,
      0,
    );

    const currentOrderCount = currentWeek.reduce(
      (sum, item) => sum + item.orders,
      0,
    );

    const previousOrderCount = previousWeek.reduce(
      (sum, item) => sum + item.orders,
      0,
    );

    // Top-selling products from delivered orders in the last 7 days
    const topItems = await Order.aggregate([
      {
        $match: {
          status: "Delivered",
          createdAt: { $gte: currentStart },
        },
      },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.name",
          sold: { $sum: "$items.quantity" },
        },
      },
      { $sort: { sold: -1 } },
      { $limit: 5 },
      {
        $project: {
          _id: 0,
          name: "$_id",
          sold: 1,
        },
      },
    ]);

    // Orders by product category (last 7 days, delivered only)
    const categoryResults = await Order.aggregate([
      {
        $match: {
          status: "Delivered",
          createdAt: { $gte: currentStart },
        },
      },
      { $unwind: "$items" },
      {
        $lookup: {
          from: "products",
          localField: "items.productId",
          foreignField: "_id",
          as: "product",
        },
      },
      {
        $unwind: {
          path: "$product",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: { $ifNull: ["$product.category", "Others"] },
          quantity: { $sum: "$items.quantity" },
        },
      },
      { $sort: { quantity: -1 } },
    ]);

    const totalCategoryQuantity = categoryResults.reduce(
      (sum, item) => sum + item.quantity,
      0,
    );

    const categoryData = categoryResults.map((item) => ({
      name: item._id,
      value: totalCategoryQuantity
        ? Math.round((item.quantity / totalCategoryQuantity) * 100)
        : 0,
    }));

    // Format recent orders for the existing dashboard table
    const formattedRecentOrders = recentOrders.map((order) => ({
      id: `#${String(order._id).slice(-6).toUpperCase()}`,
      customer: order.userId?.name || "Unknown Customer",
      items: order.items
        .map((item) => `${item.name} x${item.quantity}`)
        .join(", "),
      total: `₹${order.totalAmount}`,
      status: order.status,
    }));

    const totalRevenue = revenueResult[0]?.total || 0;

    res.status(200).json({
      stats: [
        {
          label: "Total Revenue",
          value: totalRevenue,
          change: getPercentageChange(currentRevenue, previousRevenue),
        },
        {
          label: "Total Orders",
          value: totalOrders,
          change: getPercentageChange(currentOrderCount, previousOrderCount),
        },
        {
          label: "Menu Items",
          value: totalProducts,
          change: 0,
        },
        {
          label: "Customers",
          value: totalCustomers,
          change: 0,
        },
      ],
      revenueData,
      categoryData,
      topItems,
      recentOrders: formattedRecentOrders,
    });
  } catch (error) {
    console.error("Dashboard API error:", error);

    res.status(500).json({
      message: "Failed to load dashboard statistics",
      error: error.message,
    });
  }
};

module.exports = { getDashboardStats };
