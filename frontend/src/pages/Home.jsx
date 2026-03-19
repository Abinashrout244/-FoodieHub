import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '../context/AppContext';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import { fadeInUp, staggerContainer, staggerItem, pageTransition } from '../animations/motionVariants';

const categories = ['All', 'Salad', 'Pizza', 'Burger', 'Pasta', 'Dessert', 'Drinks', 'Sandwich', 'Biryani'];

const Home = () => {
  const { products, loading, selectedCategory, setSelectedCategory, fetchProducts } = useAppContext();

  useEffect(() => {
    fetchProducts(selectedCategory);
  }, [selectedCategory]);

  return (
    <motion.div {...pageTransition}>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-dark to-dark-lighter" />
        <div className="absolute top-20 right-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
            >
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-block bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-4 border border-primary/20"
              >
                🔥 #1 Food Delivery App
              </motion.span>
              <h1 className="font-display text-4xl md:text-6xl font-bold text-white leading-tight mb-6">
                Delicious Food <br />
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Delivered Fast
                </span>
              </h1>
              <p className="text-gray-400 text-lg mb-8 leading-relaxed max-w-lg">
                Order from the best restaurants near you. Fresh ingredients, amazing flavors, and lightning-fast delivery.
              </p>
              <div className="flex gap-4">
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href="#menu"
                  className="btn-primary text-center"
                >
                  Order Now
                </motion.a>
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href="#menu"
                  className="btn-secondary text-center"
                >
                  View Menu
                </motion.a>
              </div>

              {/* Stats */}
              <div className="flex gap-8 mt-10">
                {[
                  { value: '500+', label: 'Restaurants' },
                  { value: '10K+', label: 'Happy Customers' },
                  { value: '30min', label: 'Avg. Delivery' },
                ].map((stat) => (
                  <div key={stat.label}>
                    <div className="text-2xl font-bold text-white">{stat.value}</div>
                    <div className="text-gray-500 text-sm">{stat.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 60, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="hidden md:block relative"
            >
              <div className="relative w-full h-96">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-accent/20 rounded-3xl blur-2xl" />
                <img
                  src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=400&fit=crop"
                  alt="Delicious Food"
                  className="relative w-full h-full object-cover rounded-3xl border border-white/10 shadow-2xl"
                />
                
                {/* Floating Cards */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute -top-5 -right-5 bg-dark-lighter/90 backdrop-blur-xl px-4 py-3 rounded-2xl border border-white/10 shadow-xl"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">⭐</span>
                    <div>
                      <div className="text-white font-semibold text-sm">4.9 Rating</div>
                      <div className="text-gray-400 text-xs">2K+ Reviews</div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 3.5, repeat: Infinity }}
                  className="absolute -bottom-5 -left-5 bg-dark-lighter/90 backdrop-blur-xl px-4 py-3 rounded-2xl border border-white/10 shadow-xl"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🚀</span>
                    <div>
                      <div className="text-white font-semibold text-sm">Fast Delivery</div>
                      <div className="text-gray-400 text-xs">Under 30 min</div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Menu Section */}
      <section id="menu" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-3">
            Explore Our <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Menu</span>
          </h2>
          <p className="text-gray-400 max-w-lg mx-auto">
            Choose from a wide variety of delicious dishes prepared with the freshest ingredients
          </p>
        </motion.div>

        {/* Category Filters */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex flex-wrap gap-3 justify-center mb-10"
        >
          {categories.map((cat) => (
            <motion.button
              key={cat}
              variants={staggerItem}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 ${
                selectedCategory === cat
                  ? 'bg-primary text-white shadow-lg shadow-primary/30'
                  : 'bg-dark-lighter text-gray-300 border border-gray-700 hover:border-primary/50'
              }`}
            >
              {cat}
            </motion.button>
          ))}
        </motion.div>

        {/* Products Grid */}
        {loading ? (
          <Loader />
        ) : products.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <span className="text-6xl mb-4 block">🍽️</span>
            <h3 className="text-xl text-gray-400">No items found in this category</h3>
          </motion.div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </section>
    </motion.div>
  );
};

export default Home;
