import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag } from 'react-icons/fi';
import { useAppContext } from '../context/AppContext';
import { formatPrice, getCartTotal, getImageUrl } from '../utils/helpers';
import { pageTransition, staggerContainer, staggerItem } from '../animations/motionVariants';

const Cart = () => {
  const { cart, updateCartQuantity, removeFromCart, user } = useAppContext();
  const navigate = useNavigate();

  const subtotal = getCartTotal(cart);
  const deliveryFee = cart.length > 0 ? 40 : 0;
  const total = subtotal + deliveryFee;

  const handleCheckout = () => {
    if (!user) {
      navigate('/login', { state: { from: '/checkout' } });
    } else {
      navigate('/checkout');
    }
  };

  if (cart.length === 0) {
    return (
      <motion.div {...pageTransition} className="max-w-7xl mx-auto px-4 py-20 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-8xl block mb-6">🛒</span>
          <h2 className="font-display text-3xl font-bold text-white mb-3">Your Cart is Empty</h2>
          <p className="text-gray-400 mb-8">Add some delicious items to get started!</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/')}
            className="btn-primary"
          >
            Browse Menu
          </motion.button>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div {...pageTransition} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="font-display text-3xl md:text-4xl font-bold text-white mb-8"
      >
        Shopping <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Cart</span>
      </motion.h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-4"
          >
            <AnimatePresence mode="popLayout">
              {cart.map((item) => {
                const product = item.productId || {};
                const productId = product._id || item.productId;

                return (
                  <motion.div
                    key={productId}
                    layout
                    variants={staggerItem}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20, height: 0 }}
                    className="card-glass p-4 flex flex-col sm:flex-row items-center gap-4"
                  >
                    {/* Image */}
                    <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
                      <img
                        src={getImageUrl(product.image)}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&h=200&fit=crop';
                        }}
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 text-center sm:text-left">
                      <h3 className="font-display font-semibold text-white text-lg">{product.name || 'Item'}</h3>
                      <p className="text-primary font-bold">{formatPrice(product.price)}</p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-3">
                      <motion.button
                        whileTap={{ scale: 0.8 }}
                        onClick={() => updateCartQuantity(productId, item.quantity - 1)}
                        className="w-9 h-9 rounded-lg bg-dark-lighter border border-gray-700 flex items-center justify-center text-gray-300 hover:border-primary hover:text-primary transition-all"
                      >
                        <FiMinus size={14} />
                      </motion.button>
                      <span className="text-white font-semibold w-8 text-center">{item.quantity}</span>
                      <motion.button
                        whileTap={{ scale: 0.8 }}
                        onClick={() => updateCartQuantity(productId, item.quantity + 1)}
                        className="w-9 h-9 rounded-lg bg-dark-lighter border border-gray-700 flex items-center justify-center text-gray-300 hover:border-primary hover:text-primary transition-all"
                      >
                        <FiPlus size={14} />
                      </motion.button>
                    </div>

                    {/* Item Total */}
                    <div className="text-center min-w-[80px]">
                      <span className="text-white font-bold">
                        {formatPrice((product.price || 0) * item.quantity)}
                      </span>
                    </div>

                    {/* Remove */}
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => removeFromCart(productId)}
                      className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                    >
                      <FiTrash2 size={18} />
                    </motion.button>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Cart Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-1"
        >
          <div className="card-glass p-6 sticky top-24">
            <h3 className="font-display text-xl font-bold text-white mb-6">Cart Totals</h3>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-400">
                <span>Subtotal</span>
                <span className="text-white">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Delivery Fee</span>
                <span className="text-white">{formatPrice(deliveryFee)}</span>
              </div>
              <div className="border-t border-white/10 pt-3 flex justify-between">
                <span className="text-white font-semibold">Total</span>
                <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  {formatPrice(total)}
                </span>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCheckout}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              <FiShoppingBag size={18} />
              Proceed to Checkout
            </motion.button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Cart;
