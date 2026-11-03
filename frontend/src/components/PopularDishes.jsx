import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useMotionTemplate,
  useSpring,
  useTransform,
} from "framer-motion";
import { FiArrowRight, FiArrowUpRight, FiStar } from "react-icons/fi";
import { productAPI } from "../services/api";
import { getImageUrl } from "../utils/helpers";

// Decide each card's size from its position and the total number of dishes,
// so the grid always fills with no empty space.
const getLayout = (i, n) => {
  if (n === 1) return { size: "hero", span: "lg:col-span-4 lg:row-span-2" };
  if (n === 2)
    return {
      size: i === 0 ? "hero" : "wide",
      span: "lg:col-span-2 lg:row-span-2",
    };
  if (i === 0) return { size: "hero", span: "lg:col-span-2 lg:row-span-2" };
  if (n === 3) return { size: "wide", span: "lg:col-span-2" };
  if (n === 4 && i === 3) return { size: "wide", span: "lg:col-span-2" };
  return { size: "small", span: "" };
};

const DishCard = ({ dish, index, size, span }) => {
  const ref = useRef(null);
  const hero = size === "hero";
  const wide = size === "wide";
  const showDesc = hero || wide;

  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const nx = useMotionValue(0.5);
  const ny = useMotionValue(0.5);

  const rotateX = useSpring(useTransform(ny, [0, 1], [6, -6]), {
    stiffness: 140,
    damping: 16,
  });
  const rotateY = useSpring(useTransform(nx, [0, 1], [-6, 6]), {
    stiffness: 140,
    damping: 16,
  });
  const glow = useMotionTemplate`radial-gradient(420px circle at ${px}px ${py}px, rgba(249,115,22,0.28), transparent 65%)`;

  const onMove = (e) => {
    const r = ref.current.getBoundingClientRect();
    px.set(e.clientX - r.left);
    py.set(e.clientY - r.top);
    nx.set((e.clientX - r.left) / r.width);
    ny.set((e.clientY - r.top) / r.height);
  };
  const onLeave = () => {
    nx.set(0.5);
    ny.set(0.5);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        duration: 0.7,
        delay: index * 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
      style={{ perspective: 1000 }}
      className={span}
    >
      <motion.div
        ref={ref}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className={`group relative h-full ${hero ? "min-h-[420px]" : "min-h-[280px]"}`}
      >
        {/* Gradient border */}
        <div className="absolute inset-0 rounded-[1.75rem] bg-gradient-to-br from-white/20 via-white/5 to-white/10 transition-all duration-500 group-hover:from-primary group-hover:via-orange-400 group-hover:to-accent" />

        {/* Outer glow */}
        <div className="pointer-events-none absolute -inset-2 -z-10 rounded-[2rem] bg-gradient-to-br from-primary/30 to-accent/20 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />

        {/* Card body */}
        <div className="absolute inset-px overflow-hidden rounded-[1.7rem] bg-dark-lighter">
          <img
            src={getImageUrl(dish.image)}
            alt={dish.name}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-110"
            onError={(e) => {
              e.target.src =
                "https://placehold.co/800x800/1a1a2e/ff6b35?text=🍽️";
            }}
          />

          {/* Readability gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent" />

          {/* Cursor spotlight */}
          <motion.div
            style={{ background: glow }}
            className="pointer-events-none absolute inset-0 opacity-0 mix-blend-screen transition-opacity duration-300 group-hover:opacity-100"
          />

          {/* Top row */}
          <div className="absolute inset-x-0 top-0 flex items-start justify-between p-5">
            <span className="rounded-full border border-white/20 bg-black/40 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-white backdrop-blur-md">
              {dish.category}
            </span>
            {hero ? (
              <span className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-primary to-accent px-3.5 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-white shadow-lg shadow-primary/40">
                <FiStar size={11} className="fill-current" /> Bestseller
              </span>
            ) : (
              <span className="font-display select-none text-5xl font-black leading-none text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.4)]">
                0{index + 1}
              </span>
            )}
          </div>

          {/* Bottom content */}
          <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
            <div className="flex items-end justify-between gap-4">
              <div className="min-w-0 transition-transform duration-500 lg:group-hover:-translate-y-1">
                <h3
                  className={`font-display font-black leading-tight tracking-tight text-white ${
                    hero
                      ? "text-3xl sm:text-4xl"
                      : wide
                        ? "text-2xl sm:text-3xl"
                        : "text-xl"
                  }`}
                >
                  {dish.name}
                </h3>

                <p
                  className={`mt-2 text-sm leading-relaxed text-gray-300 transition-all duration-500 ${
                    showDesc
                      ? "line-clamp-2 max-w-md"
                      : "line-clamp-2 lg:max-h-0 lg:translate-y-3 lg:opacity-0 lg:group-hover:max-h-14 lg:group-hover:translate-y-0 lg:group-hover:opacity-100"
                  }`}
                >
                  {dish.description}
                </p>

                <div className="mt-3 flex items-center gap-3">
                  <span
                    className={`bg-gradient-to-r from-primary to-accent bg-clip-text font-black text-transparent ${
                      hero ? "text-3xl" : "text-2xl"
                    }`}
                  >
                    ₹{dish.price}
                  </span>
                  <span className="h-px w-8 bg-white/30 transition-all duration-500 group-hover:w-14 group-hover:bg-primary" />
                </div>
              </div>

              <a
                href="#menu"
                aria-label={`View ${dish.name}`}
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md transition-all duration-500 group-hover:rotate-45 group-hover:border-transparent group-hover:bg-gradient-to-br group-hover:from-primary group-hover:to-accent group-hover:shadow-[0_10px_30px_-5px] group-hover:shadow-primary/70"
              >
                <FiArrowUpRight size={20} />
              </a>
            </div>
          </div>

          {/* Shine sweep */}
          <div className="pointer-events-none absolute inset-0 -translate-x-full skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
        </div>
      </motion.div>
    </motion.div>
  );
};

const Skeleton = ({ hero }) => (
  <div
    className={`animate-pulse rounded-[1.75rem] border border-white/10 bg-white/[0.04] ${
      hero ? "min-h-[420px] lg:col-span-2 lg:row-span-2" : "min-h-[280px]"
    }`}
  />
);

const PopularDishes = () => {
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await productAPI.getAll();
        // Handles both `res.data` being an array or `{ products: [...] }`
        const list = Array.isArray(res.data)
          ? res.data
          : res.data.products || res.data.data || [];
        setDishes(list.slice(0, 5));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Hide the whole section if there are no products
  if (!loading && dishes.length === 0) return null;

  return (
    <section className="relative overflow-x-clip px-4 py-24 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute left-0 top-1/4 h-96 w-96 rounded-full bg-primary/10 blur-[130px]" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-96 w-96 rounded-full bg-accent/10 blur-[130px]" />

      <div className="relative mx-auto max-w-7xl">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mb-14 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <span className="inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-primary">
              <span className="h-px w-10 bg-primary" />
              Our favourites
            </span>
            <h2 className="font-display mt-5 text-5xl font-black leading-[1.05] tracking-tight text-white md:text-6xl">
              Popular{" "}
              <span className="bg-gradient-to-r from-primary via-orange-400 to-accent bg-clip-text text-transparent">
                dishes
              </span>
            </h2>
            <p className="mt-4 max-w-md text-base font-light leading-relaxed text-gray-400">
              The plates our customers keep coming back for, made fresh the
              moment you order.
            </p>
          </div>

          <a
            href="#menu"
            className="group inline-flex items-center gap-3 self-start border-b border-white/20 pb-2 text-sm font-semibold text-white transition-colors hover:border-primary hover:text-primary sm:self-auto"
          >
            Browse all dishes
            <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-1.5" />
          </a>
        </motion.div>

        {/* Adaptive bento grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:auto-rows-[280px] lg:grid-cols-4 lg:gap-6">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} hero={i === 0} />
              ))
            : dishes.map((d, i) => {
                const { size, span } = getLayout(i, dishes.length);
                return (
                  <DishCard
                    key={d._id}
                    dish={d}
                    index={i}
                    size={size}
                    span={span}
                  />
                );
              })}
        </div>
      </div>
    </section>
  );
};

export default PopularDishes;
