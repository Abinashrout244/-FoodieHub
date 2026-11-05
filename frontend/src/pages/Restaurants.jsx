import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { FiSearch, FiX, FiStar, FiClock, FiTruck } from "react-icons/fi";
import {
  staggerContainer,
  staggerItem,
  pageTransition,
} from "../animations/motionVariants";
import { restaurantAPI } from "../services/api";
import {
  UtensilsCrossed,
  Drumstick,
  Pizza,
  Sandwich,
  CookingPot,
  Salad,
  Flame,
  Crown,
  Wheat,
  Beef,
} from "lucide-react";
import dummyRestaurants from "../utils/dummyRestaurants";

// ── Cuisine filter chips ─────────────────────────────────────────
const CUISINES = [
  { name: "All", icon: UtensilsCrossed },
  { name: "Chicken", icon: Drumstick },
  { name: "Pizza", icon: Pizza },
  { name: "Burger", icon: Sandwich },
  { name: "Biryani", icon: CookingPot },
  { name: "Salad", icon: Salad },
  { name: "North Indian", icon: Flame },
  { name: "Mughlai", icon: Crown },
  { name: "Italian", icon: Wheat },
  { name: "American", icon: Beef },
];

// ── Star display ─────────────────────────────────────────────────
const Star = ({ rating }) => {
  const col =
    rating >= 4.5
      ? "text-green-400 bg-green-400/10"
      : rating >= 4.0
        ? "text-yellow-400 bg-yellow-400/10"
        : "text-orange-400 bg-orange-400/10";
  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-bold px-1.5 py-0.5 rounded-md ${col}`}
    >
      <FiStar size={10} fill="currentColor" /> {Number(rating).toFixed(1)}
    </span>
  );
};

// ── Skeleton card ────────────────────────────────────────────────
const SkeletonCard = () => (
  <div className="bg-dark-lighter border border-white/5 rounded-2xl overflow-hidden animate-pulse">
    <div className="h-44 bg-white/5" />
    <div className="p-4 space-y-3">
      <div className="h-4 bg-white/5 rounded w-3/4" />
      <div className="h-3 bg-white/5 rounded w-1/2" />
      <div className="h-3 bg-white/5 rounded w-full" />
    </div>
  </div>
);

// ── Restaurant Card ───────────────────────────────────────────────
const RestaurantCard = ({ r }) => (
  <motion.div variants={staggerItem} className="h-full">
    <Link
      to={`/restaurants/${r._id}`}
      className="group block h-full rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
    >
      <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-dark-lighter transition-all duration-300 ease-out group-hover:-translate-y-1 group-hover:border-white/20 group-hover:shadow-[0_12px_32px_-12px_rgba(0,0,0,0.6)]">
        {/* Image */}
        <div className="relative aspect-[16/10] overflow-hidden bg-white/5">
          <img
            src={r.image}
            alt={r.name}
            loading="lazy"
            decoding="async"
            className={`h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105 ${
              !r.isOpen ? "opacity-60 grayscale" : ""
            }`}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src =
                "https://placehold.co/600x375/1a1a2e/3f3f56?text=No+Image";
            }}
          />

          {/* Bottom fade for legibility */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/70 to-transparent" />

          {/* Tags */}
          <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
            {(r.tags || []).slice(0, 2).map((t) => (
              <span
                key={t}
                className="rounded-full bg-black/50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white ring-1 ring-white/15 backdrop-blur-md"
              >
                {t}
              </span>
            ))}
          </div>

          {/* Offer */}
          {r.offer && r.isOpen && (
            <span className="absolute bottom-3 left-3 max-w-[85%] truncate rounded-md bg-primary px-2.5 py-1 text-[11px] font-semibold tracking-wide text-white">
              {r.offer}
            </span>
          )}

          {/* Closed */}
          {!r.isOpen && (
            <span className="absolute bottom-3 left-3 rounded-md bg-black/70 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-gray-300 ring-1 ring-white/10 backdrop-blur-md">
              Currently Closed
            </span>
          )}
        </div>

        {/* Details */}
        <div className="flex flex-1 flex-col p-4">
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-display text-base font-semibold leading-snug text-white transition-colors duration-200 line-clamp-1 group-hover:text-primary">
              {r.name}
            </h3>
            <div className="shrink-0">
              <Star rating={r.rating} />
            </div>
          </div>

          <p className="mt-1 text-xs text-gray-500 line-clamp-1">
            {(r.cuisines || []).join(" · ")}
          </p>

          <div className="mt-auto flex items-center gap-3 border-t border-white/5 pt-3 text-xs tabular-nums text-gray-400">
            <span className="flex items-center gap-1.5">
              <FiClock size={12} className="text-gray-500" />
              {r.deliveryTime} min
            </span>

            <span className="h-1 w-1 rounded-full bg-white/15" />

            <span
              className={`flex items-center gap-1.5 ${
                r.deliveryFee === 0 ? "font-medium text-emerald-400" : ""
              }`}
            >
              <FiTruck
                size={12}
                className={r.deliveryFee === 0 ? "" : "text-gray-500"}
              />
              {r.deliveryFee === 0 ? "Free" : `₹${r.deliveryFee}`}
            </span>

            <span className="ml-auto text-gray-300">
              ₹{r.priceForTwo} for 2
            </span>
          </div>
        </div>
      </article>
    </Link>
  </motion.div>
);

// ── Main Page ─────────────────────────────────────────────────────
const Restaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState("");
  const [activeCuisine, setActiveCuisine] = useState("All");

  // ── Fetch from backend (debounced on search) ──
  useEffect(() => {
    const timer = setTimeout(async () => {
      setLoading(true);
      setError(false);
      try {
        const { data } = await restaurantAPI.getAll(activeCuisine, search);
        setRestaurants(data);
      } catch (err) {
        console.warn("API unavailable, using dummy data:", err.message);
        // Fallback: client-side filter on dummy data
        let list = [...dummyRestaurants];
        if (search.trim()) {
          const q = search.toLowerCase();
          list = list.filter(
            (r) =>
              r.name.toLowerCase().includes(q) ||
              r.cuisines.some((c) => c.toLowerCase().includes(q)),
          );
        }
        if (activeCuisine !== "All") {
          list = list.filter((r) =>
            r.cuisines.some(
              (c) => c.toLowerCase() === activeCuisine.toLowerCase(),
            ),
          );
        }
        setRestaurants(list);
        setError(false); // don't show error — dummy data is fine
      } finally {
        setLoading(false);
      }
    }, 350); // debounce

    return () => clearTimeout(timer);
  }, [search, activeCuisine]);

  return (
    <motion.div {...pageTransition}>
      {/* ── Hero ── */}
      <section className="relative overflow-hidden py-14 md:py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-dark to-dark-lighter" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />

        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <motion.h1
              variants={staggerItem}
              className="font-display text-4xl md:text-5xl font-bold text-white mb-3"
            >
              Order from the{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Best Restaurants
              </span>
            </motion.h1>
            <motion.p variants={staggerItem} className="text-gray-400 mb-8">
              {restaurants.length > 0
                ? `${restaurants.length} restaurants`
                : "Restaurants"}{" "}
              nearby · Delivered in 15–45 mins
            </motion.p>

            {/* Search */}
            <motion.div
              variants={staggerItem}
              className="flex items-center bg-dark-lighter border border-gray-700 focus-within:border-primary/60 rounded-2xl px-4 py-3 shadow-xl gap-3 max-w-xl mx-auto"
            >
              <FiSearch className="text-gray-400 shrink-0" size={20} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder='"Hotel Megha", "Pizza", "Biryani"...'
                className="flex-1 bg-transparent text-white placeholder-gray-500 outline-none text-sm"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="p-1 text-gray-500 hover:text-white transition-colors"
                >
                  <FiX size={16} />
                </button>
              )}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Content ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 pt-5">
        {/* Cuisine Filters — hidden during search */}
        {!search.trim() && (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            role="tablist"
            aria-label="Filter by cuisine"
            className="-mx-4 mb-10 flex gap-2 overflow-x-auto px-4 py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:flex-wrap sm:justify-center sm:overflow-visible sm:px-0"
          >
            {CUISINES.map(({ name, icon: Icon }) => {
              const active = activeCuisine === name;
              return (
                <motion.button
                  key={name}
                  variants={staggerItem}
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setActiveCuisine(name)}
                  className={`group inline-flex h-10 shrink-0 items-center gap-2 rounded-full border pl-3 pr-4 text-[13px] font-medium tracking-wide transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 ${
                    active
                      ? "border-primary bg-primary text-white"
                      : "border-white/10 bg-dark-lighter text-gray-400 hover:border-white/20 hover:text-white"
                  }`}
                >
                  <Icon
                    className={`h-4 w-4 transition-colors duration-200 ${
                      active
                        ? "text-white"
                        : "text-gray-500 group-hover:text-primary"
                    }`}
                    strokeWidth={1.75}
                  />
                  {name}
                </motion.button>
              );
            })}
          </motion.div>
        )}

        {/* Result header */}
        <div className="flex items-center justify-between mb-6">
          {search.trim() ? (
            <div>
              <h2 className="text-white font-semibold text-lg">
                Results for <span className="text-primary">"{search}"</span>
              </h2>
              <p className="text-gray-500 text-sm">
                {restaurants.length} restaurant
                {restaurants.length !== 1 ? "s" : ""} found
              </p>
            </div>
          ) : (
            <h2 className="text-white font-semibold text-lg">
              {activeCuisine === "All"
                ? "All Restaurants"
                : `${activeCuisine} Restaurants`}
              <span className="text-gray-500 text-sm font-normal ml-2">
                ({restaurants.length})
              </span>
            </h2>
          )}
          {(search || activeCuisine !== "All") && (
            <button
              onClick={() => {
                setSearch("");
                setActiveCuisine("All");
              }}
              className="text-xs text-gray-500 hover:text-primary transition-colors flex items-center gap-1"
            >
              <FiX size={12} /> Clear
            </button>
          )}
        </div>

        {/* Grid / Skeletons / Empty */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="skeleton"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {Array.from({ length: 8 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </motion.div>
          ) : restaurants.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-center py-24"
            >
              <span className="text-7xl mb-4 block">🍽️</span>
              <h3 className="text-white text-xl font-semibold mb-2">
                No Restaurants Found
              </h3>
              <p className="text-gray-500 text-sm mb-6">
                Try a different search or cuisine
              </p>
              <button
                onClick={() => {
                  setSearch("");
                  setActiveCuisine("All");
                }}
                className="btn-primary text-sm py-2.5 px-6"
              >
                Show All
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {restaurants.map((r) => (
                <RestaurantCard key={r._id} r={r} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </motion.div>
  );
};

export default Restaurants;
