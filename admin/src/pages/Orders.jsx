import { useState, useEffect } from "react";
import {
  FiPackage,
  FiClock,
  FiMapPin,
  FiPhone,
  FiCreditCard,
  FiChevronDown,
} from "react-icons/fi";
import { orderAPI } from "../services/api";
import toast from "react-hot-toast";

const statuses = [
  "Processing",
  "Confirmed",
  "Preparing",
  "Out for Delivery",
  "Delivered",
  "Cancelled",
];

const statusColors = {
  Processing: "bg-yellow-500/20 text-yellow-400",
  Confirmed: "bg-blue-500/20 text-blue-400",
  Preparing: "bg-purple-500/20 text-purple-400",
  "Out for Delivery": "bg-orange-500/20 text-orange-400",
  Delivered: "bg-green-500/20 text-green-400",
  Cancelled: "bg-red-500/20 text-red-400",
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await orderAPI.getAll();
      setOrders(data);
    } catch (error) {
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await orderAPI.updateStatus(orderId, newStatus);
      setOrders(
        orders.map((o) =>
          o._id === orderId ? { ...o, status: newStatus } : o,
        ),
      );
      toast.success(`Order status updated to ${newStatus}`);
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  return (
    <div className="overflow-x-hidden max-w-6xl pt-5">
      {/* Header */}
      <div className="mb-8 flex items-center gap-4">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-accent/10 text-primary ring-1 ring-primary/20">
          <FiPackage size={22} />
        </span>
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
            <span>
              All{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Orders
              </span>
            </span>
            <span className="rounded-full bg-white/5 px-2.5 py-0.5 text-xs font-medium text-gray-400 ring-1 ring-white/10">
              {orders.length}
            </span>
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Track and manage customer orders
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 text-gray-400">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/10 border-t-primary" />
          <p className="mt-4 text-sm">Loading orders...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 bg-dark-lighter py-20 text-center">
          <span className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 text-3xl">
            📋
          </span>
          <p className="text-gray-400">No orders yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="group overflow-hidden rounded-2xl border border-white/10 bg-dark-lighter shadow-xl shadow-black/20 transition-colors duration-300 hover:border-primary/30"
            >
              {/* Top section */}
              <div className="p-5">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  {/* LEFT */}
                  <div className="flex items-start gap-4 min-w-0">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent text-sm font-bold text-white shadow-lg shadow-primary/20">
                      {(order.userId?.name || "U").charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] font-medium uppercase tracking-widest text-gray-500">
                        Order #{order._id.slice(-8).toUpperCase()}
                      </p>
                      <p className="mt-1 truncate font-semibold text-white">
                        {order.userId?.name || "User"}
                        <span className="font-normal text-gray-500">
                          {" "}
                          • {order.userId?.email || ""}
                        </span>
                      </p>
                      <div className="mt-1 flex items-center gap-1.5 text-xs text-gray-400">
                        <FiClock size={13} />
                        <span>
                          {new Date(order.createdAt).toLocaleDateString(
                            "en-IN",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            },
                          )}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* RIGHT */}
                  <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center md:w-auto">
                    <div className="relative w-full sm:w-auto">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          handleStatusChange(order._id, e.target.value)
                        }
                        className="w-full cursor-pointer appearance-none rounded-xl border border-white/10 bg-white/5 py-2 pl-3 pr-9 text-sm text-white outline-none transition-all hover:border-white/20 focus:border-primary/50 focus:ring-4 focus:ring-primary/10 sm:w-auto"
                      >
                        {statuses.map((s) => (
                          <option key={s} value={s} className="bg-dark-lighter">
                            {s}
                          </option>
                        ))}
                      </select>
                      <FiChevronDown
                        size={15}
                        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                      />
                    </div>

                    <span
                      className={`w-fit rounded-full px-3 py-1 text-xs font-medium ${
                        statusColors[order.status] ||
                        "bg-gray-500/20 text-gray-400"
                      }`}
                    >
                      {order.status}
                    </span>

                    <span className="text-xl font-bold text-white sm:ml-2">
                      <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                        ₹{order.totalAmount?.toFixed(2)}
                      </span>
                    </span>
                  </div>
                </div>

                {/* ITEMS */}
                <div className="mt-5 flex flex-wrap gap-2">
                  {order.items?.map((item, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-2 rounded-lg border border-white/5 bg-white/5 px-3 py-1.5 text-sm text-gray-300"
                    >
                      {item.name}
                      <span className="rounded-md bg-primary/15 px-1.5 py-0.5 text-xs font-semibold text-primary">
                        × {item.quantity}
                      </span>
                    </span>
                  ))}
                </div>
              </div>

              {/* ADDRESS FOOTER */}
              <div className="flex flex-col gap-2 border-t border-white/5 bg-black/20 px-5 py-3 text-xs text-gray-400 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-6 break-words">
                <span className="flex items-start gap-1.5">
                  <FiMapPin
                    size={14}
                    className="mt-0.5 shrink-0 text-primary"
                  />
                  {order.address?.street}, {order.address?.city},{" "}
                  {order.address?.state} - {order.address?.zipCode}
                </span>
                <span className="flex items-center gap-1.5">
                  <FiPhone size={14} className="shrink-0 text-primary" />
                  {order.address?.phone}
                </span>
                <span className="flex items-center gap-1.5">
                  <FiCreditCard size={14} className="shrink-0 text-primary" />
                  {order.paymentMethod === "cod"
                    ? "Cash on Delivery"
                    : "Online"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
