import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiShoppingCart, FiUser, FiMenu, FiX, FiLogOut, FiSearch } from 'react-icons/fi';
import { useAppContext } from '../context/AppContext';
import { getCartCount } from '../utils/helpers';

const Navbar = () => {
  const { user, cart, logout } = useAppContext();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();

  const cartCount = getCartCount(cart);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="fixed top-0 left-0 right-0 z-50 bg-dark/80 backdrop-blur-xl border-b border-white/10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">🍔</span>
            </div>
            <span className="font-display text-xl md:text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              FoodieHub
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="text-gray-300 hover:text-primary transition-colors duration-300 font-medium"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3 md:gap-4">
            {/* Cart */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate('/cart')}
              className="relative p-2 text-gray-300 hover:text-primary transition-colors"
            >
              <FiShoppingCart size={22} />
              {cartCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 bg-primary text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold"
                >
                  {cartCount}
                </motion.span>
              )}
            </motion.button>

            {/* Profile / Login */}
            {user ? (
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 bg-dark-lighter px-3 py-2 rounded-xl border border-gray-700 hover:border-primary/50 transition-all"
                >
                  <div className="w-7 h-7 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                    <span className="text-white text-sm font-bold">{user.name?.charAt(0).toUpperCase()}</span>
                  </div>
                  <span className="hidden md:block text-sm text-gray-300">{user.name}</span>
                </motion.button>

                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-48 bg-dark-lighter border border-gray-700 rounded-xl shadow-2xl overflow-hidden"
                    >
                      <Link
                        to="/profile"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-2 px-4 py-3 text-gray-300 hover:bg-primary/10 hover:text-primary transition-all"
                      >
                        <FiUser size={16} /> Profile
                      </Link>
                      <button
                        onClick={() => { logout(); setIsProfileOpen(false); }}
                        className="flex items-center gap-2 w-full px-4 py-3 text-gray-300 hover:bg-red-500/10 hover:text-red-400 transition-all"
                      >
                        <FiLogOut size={16} /> Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/login')}
                className="btn-primary text-sm py-2 px-4"
              >
                Login
              </motion.button>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-gray-300 hover:text-primary"
            >
              {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-dark-lighter border-t border-white/10 overflow-hidden"
          >
            <div className="px-4 py-4 space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-gray-300 hover:text-primary py-2 transition-colors font-medium"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
