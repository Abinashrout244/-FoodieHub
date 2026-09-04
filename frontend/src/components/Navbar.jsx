import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiShoppingCart,
  FiUser,
  FiMenu,
  FiX,
  FiLogOut,
  FiSearch,
} from "react-icons/fi";
import { useAppContext } from "../context/AppContext";
import { getCartCount } from "../utils/helpers";

const Navbar = () => {
  const { user, cart, products, logout, searchQuery, setSearchQuery } =
    useAppContext();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [localQuery, setLocalQuery] = useState("");
  const searchInputRef = useRef(null);
  const searchContainerRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const cartCount = getCartCount(cart);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Restaurants", path: "/restaurants" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  // Live suggestions — top 5 matches
  const suggestions =
    localQuery.trim().length >= 1
      ? products
          .filter(
            (p) =>
              p.name.toLowerCase().includes(localQuery.toLowerCase()) ||
              p.category?.toLowerCase().includes(localQuery.toLowerCase()),
          )
          .slice(0, 5)
      : [];

  // Open search bar
  const openSearch = () => {
    setIsSearchOpen(true);
    setTimeout(() => searchInputRef.current?.focus(), 50);
  };

  // Close search bar
  const closeSearch = () => {
    setIsSearchOpen(false);
    setLocalQuery("");
  };

  // Submit search → navigate to home and filter
  const handleSearch = (query) => {
    const q = query ?? localQuery;
    setSearchQuery(q);
    if (q.trim()) {
      navigate("/");
      // Smooth scroll to menu section
      setTimeout(() => {
        document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
    closeSearch();
  };

  // Click on a suggestion
  const handleSuggestionClick = (product) => {
    setSearchQuery(product.name);
    navigate("/");
    setTimeout(() => {
      document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
    closeSearch();
  };

  // Keyboard: Enter to search, Escape to close
  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
    if (e.key === "Escape") closeSearch();
  };

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target)
      ) {
        closeSearch();
      }
    };
    if (isSearchOpen) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isSearchOpen]);

  // Close profile dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (!e.target.closest("#profile-dropdown")) setIsProfileOpen(false);
    };
    if (isProfileOpen) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isProfileOpen]);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-50 bg-dark/75 backdrop-blur-xl border-b border-white/[0.06] supports-[backdrop-filter]:bg-dark/60"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo Brand Layer */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center shadow-lg shadow-primary/15 group-hover:scale-105 transition-transform duration-300">
              <span className="text-white font-bold text-xl leading-none">
                🍔
              </span>
            </div>
            <span className="font-display text-xl md:text-2xl font-black tracking-tight bg-gradient-to-r from-primary via-orange-400 to-accent bg-clip-text text-transparent">
              FoodieHub
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive =
                link.path === "/"
                  ? location.pathname === "/"
                  : location.pathname.startsWith(link.path);
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`relative py-2 text-sm font-semibold tracking-wide uppercase transition-colors duration-300 ${
                    isActive ? "text-primary" : "text-gray-400 hover:text-white"
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary to-accent rounded-full"
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 30,
                      }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Functional Actions System */}
          <div className="flex items-center gap-3">
            {/* ── Desktop Fluid Search Container ── */}
            <div ref={searchContainerRef} className="relative hidden md:block">
              <div className="flex items-center bg-white/[0.03] border border-white/10 focus-within:border-primary/50 focus-within:bg-dark-lighter/80 rounded-xl transition-all duration-300 overflow-hidden">
                <motion.div
                  animate={{ width: isSearchOpen ? 240 : 160 }}
                  className="flex items-center h-10"
                >
                  <FiSearch className="text-gray-400 ml-3 shrink-0" size={16} />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={localQuery}
                    onFocus={openSearch}
                    onChange={(e) => setLocalQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Search dishes..."
                    className="w-full bg-transparent text-white text-sm px-2.5 outline-none placeholder-gray-500 font-medium"
                  />

                  <AnimatePresence>
                    {localQuery && (
                      <motion.button
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        onClick={() => setLocalQuery("")}
                        className="p-1.5 mr-1 text-gray-500 hover:text-white rounded-md hover:bg-white/5 transition-colors"
                      >
                        <FiX size={14} />
                      </motion.button>
                    )}
                  </AnimatePresence>
                </motion.div>

                <button
                  onClick={() => handleSearch(localQuery)}
                  className="bg-primary/10 hover:bg-primary border-l border-white/10 text-primary hover:text-white px-3.5 h-10 text-xs font-bold uppercase tracking-wider transition-all"
                >
                  Go
                </button>
              </div>

              {/* Real-time Inline Context Search Drops */}
              <AnimatePresence>
                {isSearchOpen &&
                  (localQuery.trim() || suggestions.length > 0) && (
                    <motion.div
                      initial={{ opacity: 0, y: 12, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.98 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="absolute top-full right-0 mt-3 w-80 bg-dark-lighter/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50"
                    >
                      {suggestions.length > 0 ? (
                        <>
                          <p className="px-4 py-2.5 text-gray-500 text-[11px] font-bold uppercase tracking-wider border-b border-white/5 bg-white/[0.01]">
                            Suggested Matches
                          </p>
                          <div className="max-h-64 overflow-y-auto divide-y divide-white/5">
                            {suggestions.map((product) => (
                              <button
                                key={product._id}
                                onClick={() => handleSuggestionClick(product)}
                                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors text-left group"
                              >
                                <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 bg-white/5 border border-white/10">
                                  <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    onError={(e) => {
                                      e.target.src =
                                        "https://placehold.co/40x40/1a1a2e/ff6b35?text=🍔";
                                    }}
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-white text-sm font-semibold truncate group-hover:text-primary transition-colors">
                                    {product.name}
                                  </p>
                                  <p className="text-gray-400 text-xs mt-0.5">
                                    {product.category}
                                  </p>
                                </div>
                                <span className="text-primary text-sm font-bold shrink-0 bg-primary/10 px-2 py-0.5 rounded-lg">
                                  ₹{product.price}
                                </span>
                              </button>
                            ))}
                          </div>
                        </>
                      ) : (
                        localQuery.trim() && (
                          <div className="p-4 text-center text-sm text-gray-500">
                            Press Enter to search globally
                          </div>
                        )
                      )}

                      <button
                        onClick={() => handleSearch(localQuery)}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 border-t border-white/5 text-primary bg-primary/[0.02] hover:bg-primary/10 text-xs font-bold uppercase tracking-wider transition-colors"
                      >
                        <FiSearch size={14} />
                        Search all for "{localQuery}"
                      </button>
                    </motion.div>
                  )}
              </AnimatePresence>
            </div>

            {/* Shopping Cart Control */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/cart")}
              className="relative p-2.5 text-gray-400 hover:text-white rounded-xl hover:bg-white/5 transition-all"
              title="View Cart"
            >
              <FiShoppingCart size={20} />
              <AnimatePresence>
                {cartCount > 0 && (
                  <motion.span
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className="absolute -top-0.5 -right-0.5 bg-gradient-to-r from-primary to-orange-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-black border border-dark shadow-md"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

            {/* Profile Authentication Layer */}
            {user ? (
              <div className="relative" id="profile-dropdown">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-xl border border-white/10 hover:border-white/20 transition-all h-10"
                >
                  <div className="w-6 h-6 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center shadow-sm">
                    <span className="text-white text-xs font-black">
                      {user.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="hidden lg:block text-xs font-semibold text-gray-300 tracking-wide max-w-[90px] truncate">
                    {user.name}
                  </span>
                </motion.button>

                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-3 w-48 bg-dark-lighter border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50 divide-y divide-white/5"
                    >
                      <Link
                        to="/profile"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-3 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-all font-medium"
                      >
                        <FiUser size={16} className="text-gray-400" /> My
                        Profile
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          setIsProfileOpen(false);
                        }}
                        className="flex items-center gap-2.5 w-full px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-all font-semibold"
                      >
                        <FiLogOut size={16} /> Secure Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate("/login")}
                className="hidden md:block px-5 py-2 bg-white text-dark font-bold rounded-xl text-xs uppercase tracking-wider shadow-md hover:bg-gray-100 transition-colors h-10"
              >
                Login
              </motion.button>
            )}

            {/* Mobile Adaptive Navbar Drawer Switch */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2.5 text-gray-400 hover:text-white rounded-xl hover:bg-white/5 transition-all"
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Context Navigation Sheet */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden bg-dark-lighter border-t border-white/[0.08] overflow-hidden shadow-inner"
          >
            <div className="px-4 py-5 space-y-4">
              {/* Mobile Search Engine Bar */}
              <div className="flex items-center bg-dark border border-white/10 focus-within:border-primary/60 rounded-xl overflow-hidden shadow-inner">
                <FiSearch className="text-gray-500 ml-3.5 shrink-0" size={16} />
                <input
                  type="text"
                  value={localQuery}
                  onChange={(e) => setLocalQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSearch(localQuery);
                      setIsMobileMenuOpen(false);
                    }
                  }}
                  placeholder="Search food cravings..."
                  className="flex-1 bg-transparent text-white text-sm px-3 py-3 outline-none placeholder-gray-600 font-medium"
                />
                <button
                  onClick={() => {
                    handleSearch(localQuery);
                    setIsMobileMenuOpen(false);
                  }}
                  className="bg-primary hover:bg-primary/90 text-white px-4 py-3 text-xs font-bold uppercase tracking-wider transition-colors"
                >
                  Go
                </button>
              </div>

              {/* Navigation Router List Links */}
              <div className="space-y-1.5">
                {navLinks.map((link) => {
                  const isActive =
                    link.path === "/"
                      ? location.pathname === "/"
                      : location.pathname.startsWith(link.path);
                  return (
                    <Link
                      key={link.name}
                      to={link.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center justify-between py-3 px-4 rounded-xl text-sm font-semibold tracking-wide transition-all ${
                        isActive
                          ? "bg-primary/10 text-primary border border-primary/20 shadow-sm"
                          : "text-gray-400 hover:text-white hover:bg-white/[0.02]"
                      }`}
                    >
                      <span>{link.name}</span>
                      {isActive && (
                        <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                      )}
                    </Link>
                  );
                })}
              </div>

              {/* Fallback Mobile CTA Authentication */}
              {!user && (
                <button
                  onClick={() => {
                    navigate("/login");
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full py-3 bg-gradient-to-r from-primary to-orange-500 font-bold text-center rounded-xl text-xs uppercase tracking-widest text-white shadow-lg shadow-primary/15"
                >
                  Sign In
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
