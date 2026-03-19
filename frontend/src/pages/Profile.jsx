import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUser, FiMail, FiPackage, FiClock, FiX, FiCheckCircle } from 'react-icons/fi';
import { useAppContext } from '../context/AppContext';
import { orderAPI } from '../services/api';
import { formatPrice, getImageUrl } from '../utils/helpers';
import { pageTransition, staggerContainer, staggerItem, fadeInUp } from '../animations/motionVariants';
import Loader from '../components/Loader';

const statusColors = {
  Processing: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  Confirmed: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  Preparing: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  'Out for Delivery': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  Delivered: 'bg-green-500/20 text-green-400 border-green-500/30',
  Cancelled: 'bg-red-500/20 text-red-400 border-red-500/30',
};

const ORDER_STEPS = ['Processing', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered'];

const Profile = () => {
  const { user } = useAppContext();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await orderAPI.getMyOrders();
      setOrders(data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  return (
    <motion.div {...pageTransition} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* User Info */}
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        className="card-glass p-6 mb-8"
      >
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center">
            <span className="text-white text-2xl font-bold">{user?.name?.charAt(0).toUpperCase()}</span>
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-white">{user?.name}</h1>
            <div className="flex items-center gap-2 text-gray-400">
              <FiMail size={14} />
              <span>{user?.email}</span>
            </div>
            <span className="inline-block mt-1 bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full border border-primary/20">
              {user?.role}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Orders */}
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
      >
        <div className="flex items-center gap-2 mb-6">
          <FiPackage className="text-primary" size={22} />
          <h2 className="font-display text-2xl font-bold text-white">My Orders</h2>
        </div>

        {loading ? (
          <Loader />
        ) : orders.length === 0 ? (
          <div className="text-center py-16">
            <span className="text-6xl block mb-4">📦</span>
            <h3 className="text-xl text-gray-400">No orders yet</h3>
            <p className="text-gray-500 mt-1">Place your first order to see it here!</p>
          </div>
        ) : (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-4"
          >
            {orders.map((order) => (
              <motion.div
                key={order._id}
                variants={staggerItem}
                onClick={() => openModal(order)} // Trigger Modal
                className="card-glass p-5 cursor-pointer hover:border-primary/30 transition-all active:scale-[0.99]"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                  <div>
                    <p className="text-gray-500 text-xs">Order ID: {order._id}</p>
                    <div className="flex items-center gap-2 mt-1 text-gray-400 text-sm">
                      <FiClock size={14} />
                      <span>{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColors[order.status] || 'bg-gray-500/20 text-gray-400'}`}>
                      {order.status}
                    </span>
                    <span className="text-primary font-bold text-lg">{formatPrice(order.totalAmount)}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  {order.items?.map((item, i) => (
                    <div key={i} className="flex items-center gap-2 bg-dark/50 rounded-lg px-3 py-2">
                      <img
                        src={getImageUrl(item.image)}
                        alt={item.name}
                        className="w-10 h-10 rounded-lg object-cover"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100&h=100&fit=crop';
                        }}
                      />
                      <div>
                        <p className="text-white text-sm font-medium">{item.name}</p>
                        <p className="text-gray-500 text-xs">x{item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-3 pt-3 border-t border-white/5 text-gray-500 text-sm">
                  📍 {order.address?.street}, {order.address?.city} | 💳 {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.div>

      {/* --- TIMELINE MODAL --- */}
      <AnimatePresence>
        {showModal && selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-hidden">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            
            {/* Modal Body */}
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="card-glass w-full max-w-md p-6 relative z-10"
            >
              <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white"><FiX size={20}/></button>
              
              <h2 className="text-xl font-bold text-white mb-1 tracking-tight">Track Order</h2>
              <p className="text-gray-500 text-xs mb-8">ID: {selectedOrder._id}</p>

              <div className="space-y-1">
                {selectedOrder.status === 'Cancelled' ? (
                  <div className="flex gap-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                    <FiX className="text-red-500 mt-1" size={20}/>
                    <div>
                      <h4 className="text-red-400 font-bold">Cancelled</h4>
                      <p className="text-gray-400 text-sm">This order has been cancelled.</p>
                    </div>
                  </div>
                ) : (
                  ORDER_STEPS.map((step, index) => {
                    const statusIdx = ORDER_STEPS.indexOf(selectedOrder.status);
                    const isCompleted = statusIdx >= index;
                    const isCurrent = selectedOrder.status === step;

                    return (
                      <div key={step} className="relative flex gap-4">
                        {/* Line */}
                        {index !== ORDER_STEPS.length - 1 && (
                          <div className={`absolute left-[11px] top-7 w-[2px] h-8 ${isCompleted ? 'bg-primary' : 'bg-white/10'}`} />
                        )}
                        {/* Circle */}
                        <div className={`relative z-10 w-6 h-6 rounded-full flex items-center justify-center border-2 
                          ${isCompleted ? 'bg-primary border-primary' : 'bg-dark border-white/20'}`}>
                          {isCompleted ? <FiCheckCircle className="text-white" size={14} /> : <div className="w-1.5 h-1.5 rounded-full bg-white/20" />}
                        </div>
                        {/* Label */}
                        <div className="pb-8">
                          <p className={`text-sm font-medium ${isCompleted ? 'text-white' : 'text-gray-500'}`}>{step}</p>
                          {isCurrent && <span className="text-[10px] text-primary font-bold uppercase animate-pulse">Current Status</span>}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              <button 
                onClick={() => setShowModal(false)}
                className="w-full mt-4 py-3 bg-white/5 hover:bg-white/10 text-white font-medium rounded-xl transition-colors border border-white/10"
              >
                Close Tracking
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Profile;