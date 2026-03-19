import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCreditCard, FiDollarSign, FiMapPin } from 'react-icons/fi';
import { useAppContext } from '../context/AppContext';
import { orderAPI } from '../services/api';
import { formatPrice, getCartTotal, getImageUrl } from '../utils/helpers';
import { pageTransition } from '../animations/motionVariants';
import toast from 'react-hot-toast';

const Checkout = () => {
  const { cart, user, clearCart } = useAppContext();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
  });

  const subtotal = getCartTotal(cart);
  const deliveryFee = 40;
  const total = subtotal + deliveryFee;

  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!address.street || !address.city || !address.state || !address.zipCode || !address.phone) {
      toast.error('Please fill all address fields');
      return;
    }

    if (cart.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setLoading(true);
    try {
      const orderItems = cart.map((item) => {
        const product = item.productId || {};
        return {
          productId: product._id || item.productId,
          name: product.name,
          image: product.image,
          price: product.price,
          quantity: item.quantity,
        };
      });

      await orderAPI.place({
        items: orderItems,
        totalAmount: total,
        address,
        paymentMethod,
      });

      await clearCart();
      toast.success('Order placed successfully! 🎉');
      navigate('/profile');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    navigate('/');
    return null;
  }

  return (
    <motion.div {...pageTransition} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-8">
        <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Checkout</span>
      </h1>

      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Delivery Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="card-glass p-6">
              <div className="flex items-center gap-2 mb-6">
                <FiMapPin className="text-primary" size={20} />
                <h2 className="font-display text-xl font-semibold text-white">Delivery Information</h2>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-gray-400 text-sm mb-1">Street Address</label>
                  <input
                    type="text"
                    name="street"
                    value={address.street}
                    onChange={handleChange}
                    placeholder="123 Main Street, Apt 4"
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-1">City</label>
                  <input
                    type="text"
                    name="city"
                    value={address.city}
                    onChange={handleChange}
                    placeholder="New Delhi"
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-1">State</label>
                  <input
                    type="text"
                    name="state"
                    value={address.state}
                    onChange={handleChange}
                    placeholder="Delhi"
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-1">ZIP Code</label>
                  <input
                    type="text"
                    name="zipCode"
                    value={address.zipCode}
                    onChange={handleChange}
                    placeholder="110001"
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={address.phone}
                    onChange={handleChange}
                    placeholder="+91 9876543210"
                    className="input-field"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="card-glass p-6">
              <div className="flex items-center gap-2 mb-6">
                <FiCreditCard className="text-primary" size={20} />
                <h2 className="font-display text-xl font-semibold text-white">Payment Method</h2>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${
                    paymentMethod === 'cod'
                      ? 'border-primary bg-primary/10'
                      : 'border-gray-700 bg-dark-lighter hover:border-gray-600'
                  }`}
                >
                  <FiDollarSign className={paymentMethod === 'cod' ? 'text-primary' : 'text-gray-400'} size={24} />
                  <div className="text-left">
                    <div className={`font-semibold ${paymentMethod === 'cod' ? 'text-white' : 'text-gray-300'}`}>
                      Cash on Delivery
                    </div>
                    <div className="text-gray-500 text-sm">Pay when received</div>
                  </div>
                </motion.button>

                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setPaymentMethod('online')}
                  className={`p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${
                    paymentMethod === 'online'
                      ? 'border-primary bg-primary/10'
                      : 'border-gray-700 bg-dark-lighter hover:border-gray-600'
                  }`}
                >
                  <FiCreditCard className={paymentMethod === 'online' ? 'text-primary' : 'text-gray-400'} size={24} />
                  <div className="text-left">
                    <div className={`font-semibold ${paymentMethod === 'online' ? 'text-white' : 'text-gray-300'}`}>
                      Online Payment
                    </div>
                    <div className="text-gray-500 text-sm">Stripe (coming soon)</div>
                  </div>
                </motion.button>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="card-glass p-6 sticky top-24">
              <h3 className="font-display text-xl font-bold text-white mb-6">Order Summary</h3>

              <div className="space-y-3 mb-4 max-h-60 overflow-y-auto pr-2">
                {cart.map((item) => {
                  const product = item.productId || {};
                  return (
                    <div key={product._id || item.productId} className="flex items-center gap-3">
                      <img
                        src={getImageUrl(product.image)}
                        alt={product.name}
                        className="w-12 h-12 rounded-lg object-cover"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100&h=100&fit=crop';
                        }}
                      />
                      <div className="flex-1">
                        <p className="text-white text-sm font-medium">{product.name}</p>
                        <p className="text-gray-500 text-xs">Qty: {item.quantity}</p>
                      </div>
                      <span className="text-white text-sm font-medium">
                        {formatPrice((product.price || 0) * item.quantity)}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-white/10 pt-4 space-y-2">
                <div className="flex justify-between text-gray-400 text-sm">
                  <span>Subtotal</span>
                  <span className="text-white">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-400 text-sm">
                  <span>Delivery</span>
                  <span className="text-white">{formatPrice(deliveryFee)}</span>
                </div>
                <div className="border-t border-white/10 pt-2 flex justify-between">
                  <span className="text-white font-semibold">Total</span>
                  <span className="text-xl font-bold text-primary">{formatPrice(total)}</span>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="btn-primary w-full mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Placing Order...' : 'Place Order'}
              </motion.button>
            </div>
          </div>
        </div>
      </form>
    </motion.div>
  );
};

export default Checkout;
