import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiGithub, FiTwitter, FiInstagram, FiMail } from 'react-icons/fi';
import { fadeInUp, staggerContainer, staggerItem } from '../animations/motionVariants';

const Footer = () => {
  return (
    <motion.footer
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="bg-dark-lighter border-t border-white/10 mt-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <motion.div variants={staggerItem} className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center">
                <span className="text-xl">🍔</span>
              </div>
              <span className="font-display text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                FoodieHub
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Delicious food delivered to your doorstep. Experience the best cuisines from top restaurants.
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={staggerItem}>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {['Home', 'About', 'Cart', 'Profile'].map((link) => (
                <li key={link}>
                  <Link
                    to={link === 'Home' ? '/' : `/${link.toLowerCase()}`}
                    className="text-gray-400 hover:text-primary transition-colors text-sm"
                  >
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Categories */}
          <motion.div variants={staggerItem}>
            <h3 className="text-white font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              {['Pizza', 'Burger', 'Pasta', 'Salad', 'Dessert', 'Drinks'].map((cat) => (
                <li key={cat}>
                  <span className="text-gray-400 text-sm cursor-pointer hover:text-primary transition-colors">
                    {cat}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div variants={staggerItem}>
            <h3 className="text-white font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>📧 support@foodiehub.com</li>
              <li>📞 +91 9988776655</li>
              <li>📍 Delhi, India</li>
            </ul>
            <div className="flex gap-3 mt-4">
              {[FiGithub, FiTwitter, FiInstagram, FiMail].map((Icon, i) => (
                <motion.a
                  key={i}
                  whileHover={{ scale: 1.2, color: '#FF6B35' }}
                  className="text-gray-400 hover:text-primary transition-colors cursor-pointer"
                >
                  <Icon size={18} />
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 text-center">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} FoodieHub. All rights reserved. Made with ❤️
          </p>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
