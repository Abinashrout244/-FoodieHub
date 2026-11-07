import { useState, useMemo, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiSearch, FiX, FiStar, FiClock, FiTruck, FiArrowLeft,
  FiPlus, FiMinus, FiChevronDown, FiChevronUp, FiShoppingCart,
} from 'react-icons/fi';
import { staggerContainer, staggerItem, pageTransition } from '../animations/motionVariants';
import { useAppContext } from '../context/AppContext';
import { restaurantAPI } from '../services/api';
import dummyRestaurants from '../utils/dummyRestaurants';


// ─── Veg / Non-veg dot ────────────────────────────────────────────
const VegDot = ({ isVeg, size = 'sm' }) => {
  const dim = size === 'lg' ? 'w-5 h-5' : 'w-4 h-4';
  const dot = size === 'lg' ? 'w-2.5 h-2.5' : 'w-2 h-2';
  return (
    <div className={`${dim} rounded-sm border-2 flex items-center justify-center shrink-0 ${isVeg ? 'border-green-500' : 'border-red-500'}`}>
      <div className={`${dot} rounded-full ${isVeg ? 'bg-green-500' : 'bg-red-500'}`} />
    </div>
  );
};

// ─── Item Detail Modal ─────────────────────────────────────────────
const ItemModal = ({ item, qty, onAdd, onRemove, onClose }) => {
  const [imgErr, setImgErr] = useState(false);
  const [localQty, setLocalQty] = useState(qty || 0);

  // Sync local qty with parent qty
  useEffect(() => { setLocalQty(qty || 0); }, [qty]);

  // Close on backdrop click
  const handleBackdrop = (e) => { if (e.target === e.currentTarget) onClose(); };

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const handleAdd = () => {
    setLocalQty((q) => q + 1);
    onAdd(item);
  };
  const handleRemove = () => {
    if (localQty <= 0) return;
    setLocalQty((q) => q - 1);
    onRemove(item);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={handleBackdrop}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Modal Panel */}
      <motion.div
        initial={{ y: '100%', opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: '100%', opacity: 0 }}
        transition={{ type: 'spring', damping: 28, stiffness: 300 }}
        className="relative w-full sm:max-w-lg bg-[#16162a] border border-white/10 rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag handle (mobile) */}
        <div className="sm:hidden mx-auto mt-3 w-10 h-1 bg-white/20 rounded-full mb-1" />

        {/* Image */}
        <div className="relative h-52 sm:h-64 overflow-hidden">
          <img
            src={imgErr ? 'https://placehold.co/600x400/1a1a2e/ff6b35?text=🍽️' : item.image}
            alt={item.name}
            onError={() => setImgErr(true)}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#16162a] via-transparent to-transparent" />

          {/* Close btn */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 bg-dark/80 backdrop-blur rounded-full flex items-center justify-center text-white hover:bg-primary transition-colors"
          >
            <FiX size={16} />
          </button>

          {/* Badges */}
          <div className="absolute bottom-3 left-4 flex items-center gap-2">
            <VegDot isVeg={item.isVeg} size="lg" />
            {item.isBestseller && (
              <span className="bg-yellow-400/20 border border-yellow-400/40 text-yellow-400 text-xs font-bold px-2 py-0.5 rounded-full">
                ★ Bestseller
              </span>
            )}
            {item.isCustomizable && (
              <span className="bg-white/10 border border-white/20 text-gray-300 text-[10px] font-medium px-2 py-0.5 rounded-full">
                Customizable
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6">
          {/* Name + type */}
          <div className="mb-3">
            <h2 className="text-white font-display font-bold text-xl sm:text-2xl leading-tight mb-1">
              {item.name}
            </h2>
            <span className={`text-xs font-medium ${item.isVeg ? 'text-green-400' : 'text-red-400'}`}>
              {item.isVeg ? '🟢 Pure Veg' : '🔴 Non-Veg'}
            </span>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-1.5 bg-green-500/10 border border-green-500/20 px-3 py-1 rounded-xl">
              <FiStar size={13} className="text-green-400" fill="currentColor" />
              <span className="text-green-400 font-bold text-sm">{item.rating}</span>
              <span className="text-gray-500 text-xs">({item.reviews} ratings)</span>
            </div>
          </div>

          {/* Description */}
          <p className="text-gray-400 text-sm leading-relaxed mb-5">
            {item.description}
          </p>

          {/* Price + Cart Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <div>
              <span className="text-gray-500 text-xs">Price</span>
              <div className="text-white font-bold text-2xl">₹{item.price}</div>
            </div>

            <div className="flex items-center gap-3">
              {localQty === 0 ? (
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={handleAdd}
                  className="flex items-center gap-2 bg-primary hover:bg-primary/80 text-white font-bold px-6 py-3 rounded-2xl transition-all duration-300 shadow-lg shadow-primary/30"
                >
                  <FiShoppingCart size={16} />
                  Add to Cart
                </motion.button>
              ) : (
                <div className="flex items-center gap-4 bg-primary/10 border border-primary/30 rounded-2xl px-4 py-2.5">
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={handleRemove}
                    className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center text-white hover:bg-primary/80 transition-colors"
                  >
                    <FiMinus size={14} />
                  </motion.button>
                  <motion.span
                    key={localQty}
                    initial={{ scale: 1.3 }}
                    animate={{ scale: 1 }}
                    className="text-white font-bold text-lg min-w-[24px] text-center"
                  >
                    {localQty}
                  </motion.span>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={handleAdd}
                    className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center text-white hover:bg-primary/80 transition-colors"
                  >
                    <FiPlus size={14} />
                  </motion.button>
                </div>
              )}
            </div>
          </div>

          {localQty > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 text-center text-gray-500 text-xs"
            >
              Total: <span className="text-primary font-semibold">₹{item.price * localQty}</span>
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

// ─── Menu Item Row ─────────────────────────────────────────────────
const MenuItem = ({ item, onAdd, onRemove, qty, onOpenModal }) => {
  const [imgErr, setImgErr] = useState(false);

  return (
    <motion.div
      variants={staggerItem}
      className="flex items-center gap-4 py-5 border-b border-white/5 last:border-0 group"
    >
      {/* Info — clickable to open modal */}
      <div
        className="flex-1 min-w-0 cursor-pointer"
        onClick={() => onOpenModal(item)}
      >
        <div className="flex items-center gap-2 mb-1">
          <VegDot isVeg={item.isVeg} />
          {item.isBestseller && (
            <span className="text-[10px] font-bold text-yellow-400 border border-yellow-400/30 px-1.5 py-0.5 rounded">
              ★ Bestseller
            </span>
          )}
        </div>
        <h4 className="text-white font-medium text-sm mb-0.5 leading-snug group-hover:text-primary transition-colors">
          {item.name}
        </h4>
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-white font-semibold text-sm">₹{item.price}</span>
          <span className="flex items-center gap-0.5 text-xs text-green-400">
            <FiStar size={10} fill="currentColor" /> {item.rating} ({item.reviews})
          </span>
        </div>
        <p className="text-gray-500 text-xs leading-relaxed line-clamp-2">{item.description}</p>
        {item.isCustomizable && (
          <p className="text-gray-600 text-[10px] mt-1 italic">Customizable ›</p>
        )}
      </div>

      {/* Image + Add button */}
      <div className="relative shrink-0 pb-4">
        <div
          className="w-24 h-24 rounded-xl overflow-hidden bg-dark cursor-pointer"
          onClick={() => onOpenModal(item)}
        >
          <img
            src={imgErr ? 'https://placehold.co/100x100/1a1a2e/ff6b35?text=🍽️' : item.image}
            alt={item.name}
            onError={() => setImgErr(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        {/* Add / Qty control */}
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2">
          {qty === 0 ? (
            <motion.button
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.94 }}
              onClick={() => onAdd(item)}
              className="bg-dark-lighter hover:bg-primary border border-primary text-primary hover:text-white font-bold text-sm px-5 py-1.5 rounded-xl transition-all duration-300 shadow-lg whitespace-nowrap"
            >
              ADD
            </motion.button>
          ) : (
            <div className="flex items-center gap-1.5 bg-primary rounded-xl px-2 py-1 shadow-lg">
              <button onClick={() => onRemove(item)} className="text-white hover:scale-110 transition-transform p-0.5">
                <FiMinus size={13} />
              </button>
              <span className="text-white font-bold text-sm min-w-[16px] text-center">{qty}</span>
              <button onClick={() => onAdd(item)} className="text-white hover:scale-110 transition-transform p-0.5">
                <FiPlus size={13} />
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// ─── Collapsible Menu Category ─────────────────────────────────────
const MenuCategory = ({ category, items, localCart, onAdd, onRemove, onOpenModal }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="mb-4">
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex items-center justify-between w-full py-3 text-left group"
      >
        <div>
          <h3 className="text-white font-display font-semibold text-base">{category}</h3>
          <p className="text-gray-500 text-xs">{items.length} item{items.length !== 1 ? 's' : ''}</p>
        </div>
        <span className="text-gray-400 group-hover:text-primary transition-colors">
          {collapsed ? <FiChevronDown size={18} /> : <FiChevronUp size={18} />}
        </span>
      </button>

      <AnimatePresence>
        {!collapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <motion.div variants={staggerContainer} initial="hidden" animate="visible">
              {items.map((item) => (
                <MenuItem
                  key={item._id}
                  item={item}
                  qty={localCart[item._id] || 0}
                  onAdd={onAdd}
                  onRemove={onRemove}
                  onOpenModal={onOpenModal}
                />
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─── Main Detail Page ──────────────────────────────────────────────
const RestaurantDetail = () => {
  const { id } = useParams();
  const { addToCart } = useAppContext();
  const [restaurant, setRestaurant] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [localCart, setLocalCart] = useState({});
  const [selectedItem, setSelectedItem] = useState(null);
  const [vegFilter, setVegFilter] = useState(null);

  // ── Fetch restaurant from API (fallback to dummy) ──
  useEffect(() => {
    const fetchRestaurant = async () => {
      setPageLoading(true);
      try {
        const { data } = await restaurantAPI.getById(id);
        setRestaurant(data);
      } catch (err) {
        // Fallback: find in dummy data
        const found = dummyRestaurants.find((r) => r._id === id);
        if (found) {
          setRestaurant(found);
        } else {
          setRestaurant(null);
        }
      } finally {
        setPageLoading(false);
      }
    };
    fetchRestaurant();
  }, [id]);

  // ── These must be declared before any early returns (Rules of Hooks) ──
  const allCategories = (restaurant?.menu || []).map((s) => s.category);

  const filteredMenu = useMemo(() => {
    if (!restaurant) return [];
    const q = search.trim().toLowerCase();
    return (restaurant.menu || [])
      .map((section) => ({
        ...section,
        items: (section.items || []).filter((item) => {
          const matchesSearch = !q || (item.name?.toLowerCase().includes(q)) || (item.description?.toLowerCase().includes(q));
          const matchesVeg =
            vegFilter === null ||
            (vegFilter === 'veg' && item.isVeg) ||
            (vegFilter === 'nonveg' && !item.isVeg);
          return matchesSearch && matchesVeg;
        }),
      }))
      .filter((s) => s.items.length > 0);
  }, [search, vegFilter, restaurant]);

  const totalItemsShown = filteredMenu.reduce((acc, s) => acc + s.items.length, 0);

  // ── Loading skeleton ──
  if (pageLoading) {
    return (
      <div className="min-h-screen">
        <div className="h-56 md:h-72 bg-white/5 animate-pulse" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-dark-lighter border border-white/10 rounded-2xl p-6 -mt-10 relative z-10 animate-pulse">
            <div className="h-8 bg-white/5 rounded w-1/2 mb-3" />
            <div className="h-4 bg-white/5 rounded w-1/3 mb-2" />
            <div className="h-3 bg-white/5 rounded w-1/4" />
          </div>
          <div className="grid grid-cols-1 gap-4 mt-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex gap-4 py-5 border-b border-white/5 animate-pulse">
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-white/5 rounded w-3/4" />
                  <div className="h-3 bg-white/5 rounded w-1/2" />
                  <div className="h-3 bg-white/5 rounded w-full" />
                </div>
                <div className="w-24 h-24 bg-white/5 rounded-xl shrink-0" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <span className="text-6xl">🍽️</span>
        <h2 className="text-white text-xl font-semibold">Restaurant not found</h2>
        <Link to="/restaurants" className="btn-primary text-sm py-2.5 px-6">← Browse Restaurants</Link>
      </div>
    );
  }

  const handleAdd = (item) => {
    setLocalCart((prev) => ({ ...prev, [item._id]: (prev[item._id] || 0) + 1 }));
    addToCart({ _id: item._id, name: item.name, price: item.price, image: item.image });
  };

  const handleRemove = (item) => {
    setLocalCart((prev) => {
      const current = prev[item._id] || 0;
      if (current <= 1) { const next = { ...prev }; delete next[item._id]; return next; }
      return { ...prev, [item._id]: current - 1 };
    });
  };

  const cartTotal = Object.entries(localCart).reduce((acc, [itemId, qty]) => {
    const item = (restaurant.menu || []).flatMap((s) => s.items || []).find((i) => i._id === itemId);
    return acc + (item ? item.price * qty : 0);
  }, 0);
  const cartItemCount = Object.values(localCart).reduce((a, b) => a + b, 0);

  return (
    <motion.div {...pageTransition}>

      {/* ── Hero ── */}
      <section className="relative h-56 md:h-72 overflow-hidden">
        <img src={restaurant.image} alt={restaurant.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/60 to-transparent" />
        <Link
          to="/restaurants"
          className="absolute top-5 left-4 md:left-8 flex items-center gap-2 bg-dark/70 backdrop-blur-md text-white px-3 py-2 rounded-xl hover:bg-primary/80 transition-all text-sm border border-white/10"
        >
          <FiArrowLeft size={16} /> Restaurants
        </Link>
        {!restaurant.isOpen && (
          <div className="absolute top-5 right-4 bg-red-500/80 backdrop-blur text-white text-xs font-bold px-3 py-1.5 rounded-xl">
            Currently Closed
          </div>
        )}
      </section>

      {/* ── Restaurant Info Card ── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-dark-lighter border border-white/10 rounded-2xl p-5 md:p-6 -mt-10 relative z-10 mb-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <h1 className="font-display text-2xl md:text-3xl font-bold text-white mb-1">{restaurant.name}</h1>
              <p className="text-gray-400 text-sm mb-2">{(restaurant.cuisines || []).join(' · ')}</p>
              <p className="text-gray-500 text-xs">📍 {restaurant.location}</p>
            </div>
            <div className="flex flex-wrap gap-5 shrink-0">
              {[
                { icon: <FiStar size={14} fill="currentColor" />, val: restaurant.rating, sub: `${restaurant.totalRatings} ratings`, col: 'text-green-400' },
                { icon: <FiClock size={13} className="text-primary" />, val: restaurant.deliveryTime, sub: 'mins', col: 'text-white' },
                { icon: <FiTruck size={13} />, val: restaurant.deliveryFee === 0 ? 'Free' : `₹${restaurant.deliveryFee}`, sub: 'delivery', col: restaurant.deliveryFee === 0 ? 'text-green-400' : 'text-white' },
              ].map((s, i) => (
                <div key={i} className="text-center">
                  <div className={`flex items-center gap-1 font-bold text-sm justify-center ${s.col}`}>{s.icon} {s.val}</div>
                  <div className="text-gray-500 text-[10px]">{s.sub}</div>
                </div>
              ))}
            </div>
          </div>
          {restaurant.offer && (
            <div className="mt-4 bg-primary/10 border border-primary/20 rounded-xl px-4 py-2 text-primary text-sm font-medium">
              🎉 {restaurant.offer}
            </div>
          )}
        </div>

        {/* ── Menu ── */}
        <div className="flex gap-6 pb-32">

          {/* Sidebar */}
          <div className="hidden lg:block w-48 shrink-0">
            <div className="sticky top-24 space-y-1">
              <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-3">Menu</p>
              {allCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => document.getElementById(`cat-${cat}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                  className="w-full text-left px-3 py-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 text-sm transition-all"
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Items */}
          <div className="flex-1 min-w-0">
            {/* Search */}
            <div className="flex items-center bg-dark-lighter border border-gray-700 focus-within:border-primary/60 rounded-xl px-4 py-3 gap-3 mb-4">
              <FiSearch className="text-gray-500 shrink-0" size={16} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={`Search in ${restaurant.name}...`}
                className="flex-1 bg-transparent text-white text-sm outline-none placeholder-gray-500"
              />
              {search && (
                <button onClick={() => setSearch('')} className="text-gray-500 hover:text-white transition-colors">
                  <FiX size={15} />
                </button>
              )}
            </div>

            {/* ── Veg / Non-Veg filter toggles ── */}
            <div className="flex items-center gap-3 mb-5">
              <button
                onClick={() => setVegFilter(vegFilter === 'veg' ? null : 'veg')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-all duration-300 ${
                  vegFilter === 'veg'
                    ? 'bg-green-500/20 border-green-500 text-green-400 shadow-lg shadow-green-500/10'
                    : 'bg-dark-lighter border-gray-700 text-gray-400 hover:border-green-500/50 hover:text-green-400'
                }`}
              >
                <div className="w-4 h-4 rounded-sm border-2 border-green-500 flex items-center justify-center shrink-0">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                </div>
                Veg
                {vegFilter === 'veg' && (
                  <span className="ml-1 text-green-400">
                    <FiX size={12} />
                  </span>
                )}
              </button>

              <button
                onClick={() => setVegFilter(vegFilter === 'nonveg' ? null : 'nonveg')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-all duration-300 ${
                  vegFilter === 'nonveg'
                    ? 'bg-red-500/20 border-red-500 text-red-400 shadow-lg shadow-red-500/10'
                    : 'bg-dark-lighter border-gray-700 text-gray-400 hover:border-red-500/50 hover:text-red-400'
                }`}
              >
                <div className="w-4 h-4 rounded-sm border-2 border-red-500 flex items-center justify-center shrink-0">
                  <div className="w-2 h-2 rounded-full bg-red-500" />
                </div>
                Non-Veg
                {vegFilter === 'nonveg' && (
                  <span className="ml-1 text-red-400">
                    <FiX size={12} />
                  </span>
                )}
              </button>

              {(vegFilter || search.trim()) && (
                <button
                  onClick={() => { setVegFilter(null); setSearch(''); }}
                  className="ml-auto text-xs text-gray-500 hover:text-primary transition-colors flex items-center gap-1"
                >
                  <FiX size={11} /> Clear all
                </button>
              )}
            </div>

            {(search.trim() || vegFilter) && (
              <p className="text-gray-500 text-xs mb-4">
                {totalItemsShown} item{totalItemsShown !== 1 ? 's' : ''} found
                {search.trim() ? ` for "${search}"` : ''}
                {vegFilter ? ` · ${vegFilter === 'veg' ? '🟢 Veg only' : '🔴 Non-Veg only'}` : ''}
              </p>
            )}

            {filteredMenu.length === 0 ? (
              <div className="text-center py-16">
                <span className="text-5xl block mb-3">🔍</span>
                <p className="text-gray-400">No items match "{search}"</p>
                <button onClick={() => setSearch('')} className="mt-3 text-primary text-sm hover:underline">Clear search</button>
              </div>
            ) : (
              filteredMenu.map((section) => (
                <div key={section.category} id={`cat-${section.category}`}>
                  <MenuCategory
                    category={section.category}
                    items={section.items}
                    localCart={localCart}
                    onAdd={handleAdd}
                    onRemove={handleRemove}
                    onOpenModal={setSelectedItem}
                  />
                  <div className="border-t border-white/5 mb-4" />
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* ── Item Detail Modal ── */}
      <AnimatePresence>
        {selectedItem && (
          <ItemModal
            item={selectedItem}
            qty={localCart[selectedItem._id] || 0}
            onAdd={handleAdd}
            onRemove={handleRemove}
            onClose={() => setSelectedItem(null)}
          />
        )}
      </AnimatePresence>

      {/* ── Floating Cart Bar ── */}
      <AnimatePresence>
        {cartItemCount > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-md"
          >
            <Link to="/cart">
              <div className="bg-primary rounded-2xl px-5 py-4 flex items-center justify-between shadow-2xl shadow-primary/40">
                <div>
                  <div className="text-white font-bold text-sm">{cartItemCount} item{cartItemCount !== 1 ? 's' : ''} added</div>
                  <div className="text-white/70 text-xs">₹{cartTotal} total</div>
                </div>
                <div className="flex items-center gap-2 text-white font-bold text-sm">
                  View Cart <FiArrowLeft className="rotate-180" size={16} />
                </div>
              </div>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default RestaurantDetail;
