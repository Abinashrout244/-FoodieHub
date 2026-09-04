import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Flame,
  ArrowRight,
  UtensilsCrossed,
  Star,
  Clock3,
  ShieldCheck,
  Sparkles,
  MapPin,
} from "lucide-react";

// 5 Featured Dishes with matched details
const dishes = [
  {
    id: 1,
    tag: "Chef Special",
    restaurant: "Osteria Del Sole",
    title: "Tagliolini al Tartufo",
    desc: "Handmade pasta & fresh summer truffle",
    price: "₹24.00",
    image:
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: 2,
    tag: "Trending",
    restaurant: "The Flame Grille",
    title: "Smoked Wagyu Burger",
    desc: "Aged white cheddar, caramelized onion relish",
    price: "₹19.50",
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: 3,
    tag: "Woodfired",
    restaurant: "Napoli Crust Co.",
    title: "Artisan Pepperoni Classico",
    desc: "San Marzano sauce, spicy nduja, basil",
    price: "₹22.00",
    image:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: 4,
    tag: "Farm Fresh",
    restaurant: "Nourish Botanical",
    title: "Wild Salmon Poke Bowl",
    desc: "Sashimi-grade salmon, edamame, ponzu sesame",
    price: "₹21.00",
    image:
      "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: 5,
    tag: "House Special",
    restaurant: "Spice Dynasty",
    title: "Hyderabadi Dum Biryani",
    desc: "Slow-braised spiced lamb, saffron basmati",
    price: "₹23.50",
    image:
      "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=1000&q=80",
  },
];

const Hero = () => {
  const [currentDish, setCurrentDish] = useState(0);

  // Auto-slide every 4.5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDish((prev) => (prev + 1) % dishes.length);
    }, 4500);

    return () => clearInterval(timer);
  }, []);

  const active = dishes[currentDish];

  return (
    <section className="relative min-h-[90vh] flex items-center bg-[#0b0e14] text-white overflow-hidden pt-12 pb-20 lg:py-24">
      {/* Theme Ambient Radial Glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 right-1/4 w-[520px] h-[520px] bg-[#FF6B00]/12 rounded-full blur-[140px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-10 w-[420px] h-[420px] bg-orange-700/[0.08] rounded-full blur-[130px]"
      />

      {/* Subtle Texture Grid */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4.5rem_4.5rem] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_40%,#000_65%,transparent_100%)] pointer-events-none"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          {/* Left Narrative Column */}
          <div className="lg:col-span-7 flex flex-col items-start space-y-7">
            {/* Pill Badge */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-orange-500/20 bg-[#161a23]/90 backdrop-blur-md shadow-sm"
            >
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#FF6B00]/20 text-[#FF6B00]">
                <Flame className="w-3.5 h-3.5" />
              </span>
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-300">
                Fresh Flavor • Straight to Door
              </span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-6xl xl:text-7xl font-extrabold tracking-tight leading-[1.08]"
            >
              Craving Solved. <br />
              <span className="bg-gradient-to-r from-[#FF6B00] via-orange-400 to-amber-300 bg-clip-text text-transparent">
                Delivered in Style.
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-neutral-400 text-base sm:text-lg max-w-xl font-normal leading-relaxed"
            >
              Skip the kitchen drama. Experience signature dishes prepared daily
              with handpicked local ingredients from your city's celebrated
              kitchens.
            </motion.p>

            {/* Call to Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto pt-2"
            >
              <a
                href="#menu"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-sm text-white bg-[#FF6B00] hover:bg-[#e05e00] shadow-lg shadow-orange-600/25 transition-all duration-200 active:scale-[0.98]"
              >
                <span>Order Now</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href="#menu"
                className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl font-semibold text-sm text-neutral-200 hover:text-white bg-[#141822] hover:bg-[#1a202c] border border-white/10 transition-colors active:scale-[0.98]"
              >
                <UtensilsCrossed className="w-4 h-4 text-orange-400" />
                <span>Explore Menu</span>
              </a>
            </motion.div>

            {/* Metric Strips */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="pt-6 border-t border-neutral-800/80 w-full flex flex-wrap items-center gap-6 sm:gap-10 text-xs text-neutral-400"
            >
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span className="font-semibold text-white">4.92</span>
                <span className="text-neutral-500">(10k+ foodies)</span>
              </div>

              <div className="flex items-center gap-2">
                <Clock3 className="w-4 h-4 text-orange-400" />
                <span>35-45 min average courier pace</span>
              </div>

              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Zero kitchen compromises</span>
              </div>
            </motion.div>
          </div>

          {/* Right Showcase Column (Animated Carousel) */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Outer Card Container */}
              <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-[#141721] p-3 shadow-2xl backdrop-blur-xl">
                <div className="relative h-[440px] sm:h-[490px] w-full rounded-2xl overflow-hidden bg-black/40">
                  {/* Sliding Dish Image */}
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={active.id}
                      src={active.image}
                      alt={active.title}
                      initial={{ opacity: 0, scale: 1.08 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.7, ease: "easeInOut" }}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  </AnimatePresence>

                  {/* Gradient Overlay for Readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0b0e14]/95 via-[#0b0e14]/20 to-black/30 pointer-events-none" />

                  {/* Dynamic Chef Tag */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`tag-₹{active.id}`}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className="absolute top-4 left-4 z-10"
                    >
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF6B00] text-white text-xs font-bold shadow-md">
                        {active.tag}
                      </span>
                    </motion.div>
                  </AnimatePresence>

                  {/* Progress Indicator Dots */}
                  <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-2.5 py-1.5 rounded-full border border-white/10">
                    {dishes.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentDish(index)}
                        className={`h-1.5 rounded-full transition-all duration-300 ₹{
                          currentDish === index
                            ? "w-5 bg-[#FF6B00]"
                            : "w-1.5 bg-white/30 hover:bg-white/60"
                        }`}
                        aria-label={`Go to slide ₹{index + 1}`}
                      />
                    ))}
                  </div>

                  {/* In-Card Restaurant & Dish Details */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`info-₹{active.id}`}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.4 }}
                      className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-[#0f131c]/90 backdrop-blur-md border border-white/10 flex items-center justify-between z-10"
                    >
                      <div className="pr-3">
                        <div className="flex items-center gap-1.5 text-[11px] text-orange-400 font-medium">
                          <MapPin className="w-3 h-3 flex-shrink-0" />
                          <span className="truncate">{active.restaurant}</span>
                        </div>
                        <h3 className="text-base font-bold text-white mt-0.5 leading-tight">
                          {active.title}
                        </h3>
                        <p className="text-xs text-neutral-400 mt-0.5 line-clamp-1">
                          {active.desc}
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <span className="text-lg font-black text-white">
                          {active.price}
                        </span>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              {/* Floating Live Dispatch Badge */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="absolute -top-5 -right-4 hidden sm:flex items-center gap-3 bg-[#161a24]/95 border border-white/10 px-4 py-3 rounded-2xl shadow-xl backdrop-blur-md z-20"
              >
                <div className="p-2 rounded-xl bg-[#FF6B00]/15 text-[#FF6B00]">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">
                    Live Dispatch Line
                  </div>
                  <div className="text-[11px] text-neutral-400">
                    Curated temperature-locked bags
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
