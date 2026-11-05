import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppContext } from "../context/AppContext";
import ProductCard from "../components/ProductCard";
import Loader from "../components/Loader";
import {
  fadeInUp,
  staggerContainer,
  staggerItem,
  pageTransition,
} from "../animations/motionVariants";
import Hero from "../components/Hero";
import PopularDishes from "../components/PopularDishes";
import WhyChooseUs from "../components/WhyChooseUs";
import CustomerReviews from "../components/CustomerReviews";
import { categories } from "../utils/categories";

const Home = () => {
  const {
    products,
    loading,
    selectedCategory,
    setSelectedCategory,
    fetchProducts,
    searchQuery,
    setSearchQuery,
  } = useAppContext();

  // Keeps the Popular Dishes list fixed when a category filter is applied
  const [popularSource, setPopularSource] = useState([]);

  if (
    selectedCategory === "All" &&
    products.length &&
    products !== popularSource
  ) {
    setPopularSource(products);
  }
  // useEffect(() => {
  //   if (selectedCategory === "All" && products.length) {
  //     setPopularSource(products);
  //   }
  // }, [products, selectedCategory]);

  useEffect(() => {
    fetchProducts(selectedCategory === "All" ? undefined : selectedCategory);
  }, [selectedCategory]);

  const filteredProducts = searchQuery.trim()
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description?.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : products;

  return (
    <motion.div {...pageTransition}>
      {/* 1. Hero */}
      <Hero />

      {/* 2. Popular Dishes */}
      <PopularDishes products={popularSource} />

      {/* 3. Menu Section */}
      <section
        id="menu"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10"
      >
        {/* Section Header */}
        <div className="text-center mb-12 relative">
          <AnimatePresence mode="wait">
            {searchQuery.trim() ? (
              <motion.div
                key="search-heading"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="flex flex-col items-center"
              >
                <h2 className="font-display text-3xl md:text-5xl font-black text-white mb-3 tracking-tight">
                  Results for{" "}
                  <span className="bg-gradient-to-r from-primary via-orange-400 to-accent bg-clip-text text-transparent">
                    "{searchQuery}"
                  </span>
                </h2>
                <p className="text-gray-400 text-sm md:text-base font-medium bg-white/5 border border-white/5 px-4 py-1 rounded-full shadow-sm backdrop-blur-md">
                  {filteredProducts.length}{" "}
                  {filteredProducts.length === 1 ? "item" : "items"} found
                </p>
                <button
                  onClick={() => setSearchQuery("")}
                  className="mt-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary hover:text-white border border-primary/20 hover:border-primary bg-primary/10 hover:bg-primary px-5 py-2 rounded-xl transition-all duration-300 shadow-md"
                >
                  ✕ Clear Filter
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="normal-heading"
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <h2 className="font-display text-3xl md:text-5xl font-black text-white mb-4 tracking-tight">
                  Explore Our{" "}
                  <span className="bg-gradient-to-r from-primary via-orange-400 to-accent bg-clip-text text-transparent">
                    Menu
                  </span>
                </h2>
                <p className="text-gray-400 max-w-xl mx-auto text-base md:text-lg font-light leading-relaxed">
                  Choose from a wide variety of delicious dishes prepared daily
                  with the freshest local ingredients.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Category Filters (hidden while a search query is active) */}
        <AnimatePresence>
          {!searchQuery.trim() && (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              viewport={{ once: true }}
              className="flex flex-wrap gap-4 md:gap-6 justify-center mb-16"
            >
              {categories.map((cat) => {
                const isActive = selectedCategory === cat.name;
                return (
                  <motion.button
                    key={cat.name}
                    variants={staggerItem}
                    whileHover={{ scale: 1.05, y: -4 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => setSelectedCategory(cat.name)}
                    className="flex flex-col items-center gap-3 group relative focus:outline-none"
                  >
                    <div
                      className={`relative w-16 h-16 md:w-20 md:h-20 rounded-2xl overflow-hidden transition-all duration-300 border ${
                        isActive
                          ? "border-primary shadow-xl shadow-primary/20 scale-105"
                          : "border-white/10 group-hover:border-white/30"
                      }`}
                    >
                      <img
                        src={cat.image}
                        alt={cat.name}
                        className={`w-full h-full object-cover transition-all duration-500 ${
                          isActive
                            ? "scale-110 brightness-110"
                            : "brightness-90 group-hover:scale-105 group-hover:brightness-100"
                        }`}
                      />

                      {cat.name === "All" && (
                        <div className="absolute inset-0 flex items-center justify-center bg-dark/40 backdrop-blur-[1px]">
                          <span className="text-2xl">{cat.emoji}</span>
                        </div>
                      )}

                      {isActive && (
                        <motion.div
                          layoutId="category-active-bg"
                          className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent mix-blend-overlay"
                          transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 30,
                          }}
                        />
                      )}
                    </div>

                    <span
                      className={`text-xs md:text-sm font-semibold tracking-wide transition-colors duration-300 ${
                        isActive
                          ? "text-primary font-bold"
                          : "text-gray-400 group-hover:text-white"
                      }`}
                    >
                      {cat.name}
                    </span>
                  </motion.button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Products Grid */}
        <div className="min-h-[400px] relative">
          {loading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader />
            </div>
          ) : filteredProducts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-md mx-auto text-center py-16 px-6 bg-white/[0.02] border border-white/5 rounded-3xl backdrop-blur-md shadow-xl"
            >
              <span className="text-5xl mb-4 block animate-bounce">
                {searchQuery ? "🔍" : "🍽️"}
              </span>
              <h3 className="text-xl font-bold text-white mb-2">
                {searchQuery ? "No Matches Found" : "Empty Plates Here"}
              </h3>
              <p className="text-gray-400 text-sm max-w-xs mx-auto">
                {searchQuery
                  ? `We couldn't find anything matching "${searchQuery}". Try double checking your spelling.`
                  : "We are working on bringing recipes into this category shortly!"}
              </p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="mt-6 text-sm text-primary font-medium hover:text-white transition-colors underline decoration-dotted underline-offset-4"
                >
                  Clear search and browse all dishes
                </button>
              )}
            </motion.div>
          ) : (
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8"
            >
              <AnimatePresence mode="popLayout">
                {filteredProducts.map((product) => (
                  <motion.div
                    key={product._id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ opacity: { duration: 0.2 } }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </section>

      {/* 4. Why Choose FoodieHub */}
      <WhyChooseUs />

      {/* 5. Customer Reviews */}
      <CustomerReviews />
    </motion.div>
  );
};

export default Home;
