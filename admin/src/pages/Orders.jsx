import { useState, useEffect } from 'react';
import { FiPackage, FiClock } from 'react-icons/fi';
import { orderAPI } from '../services/api';
import toast from 'react-hot-toast';

const statuses = ['Processing', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'];

const statusColors = {
  Processing: 'bg-yellow-500/20 text-yellow-400',
  Confirmed: 'bg-blue-500/20 text-blue-400',
  Preparing: 'bg-purple-500/20 text-purple-400',
  'Out for Delivery': 'bg-orange-500/20 text-orange-400',
  Delivered: 'bg-green-500/20 text-green-400',
  Cancelled: 'bg-red-500/20 text-red-400',
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
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await orderAPI.updateStatus(orderId, newStatus);
      setOrders(orders.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o)));
      toast.success(`Order status updated to ${newStatus}`);
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  return (
    <div className="overflow-x-hidden">
      <div className="flex items-center gap-2 mb-6">
        <FiPackage className="text-primary" size={24} />
        <h1 className="font-display text-2xl font-bold text-white">
          All <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Orders</span>
          <span className="text-gray-500 text-sm font-normal ml-2">({orders.length})</span>
        </h1>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-400">Loading orders...</div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20">
          <span className="text-6xl block mb-4">📋</span>
          <p className="text-gray-400">No orders yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="card-glass p-5">

              {/* ✅ HEADER */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-3">
                
                {/* LEFT */}
                <div>
                  <p className="text-gray-500 text-xs">
                    Order #{order._id.slice(-8).toUpperCase()}
                  </p>

                  <p className="text-white font-medium mt-1">
                    {order.userId?.name || 'User'} • {order.userId?.email || ''}
                  </p>

                  <div className="flex items-center gap-2 text-gray-400 text-sm mt-1">
                    <FiClock size={14} />
                    <span>
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>

                {/* RIGHT (RESPONSIVE FIX) */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 w-full md:w-auto">
                  
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    className="w-full sm:w-auto bg-dark-lighter border border-gray-700 text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary"
                  >
                    {statuses.map((s) => (
                      <option key={s} value={s} className="bg-dark-lighter">
                        {s}
                      </option>
                    ))}
                  </select>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium w-fit ${statusColors[order.status] || 'bg-gray-500/20 text-gray-400'}`}
                  >
                    {order.status}
                  </span>

                  <span className="text-primary font-bold text-lg">
                    ₹{order.totalAmount?.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* ✅ ITEMS */}
              <div className="flex flex-wrap gap-2 mb-3">
                {order.items?.map((item, i) => (
                  <span
                    key={i}
                    className="bg-dark/50 px-3 py-1 rounded-lg text-sm text-gray-300"
                  >
                    {item.name} × {item.quantity}
                  </span>
                ))}
              </div>

              {/* ✅ ADDRESS (FIX OVERFLOW) */}
              <div className="text-gray-500 text-sm pt-2 border-t border-white/5 break-words">
                📍 {order.address?.street}, {order.address?.city}, {order.address?.state} - {order.address?.zipCode} |
                📞 {order.address?.phone} |
                💳 {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online'}
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;