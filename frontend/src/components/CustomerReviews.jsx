import { useRef } from "react";
import { motion, useMotionValue, useMotionTemplate } from "framer-motion";
import { FiStar } from "react-icons/fi";

// Static sample reviews: replace with your own real ones
const reviews = [
  {
    name: "Rahul Sharma",
    role: "Regular customer",
    text: "The food always arrives hot and on time. The burgers are my absolute favourite!",
    rating: 5,
  },
  {
    name: "Priya Patel",
    role: "Food lover",
    text: "Ordering is super easy and the pizza tastes like it came straight from the oven.",
    rating: 5,
  },
  {
    name: "Amit Verma",
    role: "Verified buyer",
    text: "Great variety and fair prices. Delivery tracking is a really nice touch.",
    rating: 4,
  },
];

const Stars = ({ rating }) => (
  <div className="flex gap-1">
    {Array.from({ length: 5 }).map((_, i) => (
      <FiStar
        key={i}
        size={16}
        className={i < rating ? "fill-accent text-accent" : "text-gray-700"}
      />
    ))}
  </div>
);

const ReviewCard = ({ r, index, featured }) => {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const glow = useMotionTemplate`radial-gradient(380px circle at ${x}px ${y}px, rgba(249,115,22,0.22), transparent 70%)`;

  const onMove = (e) => {
    const b = ref.current.getBoundingClientRect();
    x.set(e.clientX - b.left);
    y.set(e.clientY - b.top);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: 0.7,
        delay: index * 0.12,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{ y: -10 }}
      className={`group relative ${featured ? "md:-translate-y-6" : ""}`}
    >
      {/* Gradient border */}
      <div
        className={`absolute inset-0 rounded-[1.75rem] bg-gradient-to-br transition-all duration-500 group-hover:from-primary group-hover:via-orange-400 group-hover:to-accent ${
          featured
            ? "from-primary via-orange-400/60 to-accent"
            : "from-white/20 via-white/5 to-white/10"
        }`}
      />

      {/* Outer glow */}
      <div
        className={`pointer-events-none absolute -inset-3 -z-10 rounded-[2.25rem] bg-gradient-to-br from-primary/30 to-accent/20 blur-2xl transition-opacity duration-500 group-hover:opacity-100 ${
          featured ? "opacity-60" : "opacity-0"
        }`}
      />

      {/* Card body */}
      <div
        ref={ref}
        onMouseMove={onMove}
        className="relative m-px flex h-full flex-col overflow-hidden rounded-[1.7rem] bg-dark-lighter p-7 sm:p-8"
      >
        {/* Cursor glow */}
        <motion.div
          style={{ background: glow }}
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        />

        {/* Giant quote mark */}
        <span className="font-display pointer-events-none absolute -right-1 -top-4 select-none text-[9rem] font-black leading-none text-transparent [-webkit-text-stroke:1px_rgba(249,115,22,0.3)] transition-all duration-500 group-hover:[-webkit-text-stroke:1px_rgba(249,115,22,0.8)]">
          ”
        </span>

        <div className="relative flex items-center justify-between">
          <Stars rating={r.rating} />
          {featured && (
            <span className="rounded-full bg-gradient-to-r from-primary to-accent px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-white shadow-lg shadow-primary/40">
              Top review
            </span>
          )}
        </div>

        <p className="relative mt-6 flex-1 text-lg font-medium leading-relaxed text-gray-200 sm:text-xl">
          “{r.text}”
        </p>

        <div className="relative mt-8 flex items-center gap-4 border-t border-white/10 pt-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-base font-bold text-white shadow-[0_10px_30px_-5px] shadow-primary/50 ring-2 ring-white/10">
            {r.name.charAt(0)}
          </div>
          <div>
            <p className="text-sm font-semibold text-white">{r.name}</p>
            <p className="text-xs text-gray-500">{r.role}</p>
          </div>
        </div>

        {/* Shine sweep */}
        <div className="pointer-events-none absolute inset-0 -translate-x-full skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/[0.06] to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
      </div>
    </motion.div>
  );
};

const CustomerReviews = () => (
  <section className="relative overflow-x-clip px-4 py-28 sm:px-6 lg:px-8">
    <div className="pointer-events-none absolute left-1/2 top-1/3 h-[32rem] w-[32rem] -translate-x-1/2 rounded-full bg-primary/10 blur-[140px]" />

    <div className="relative mx-auto max-w-7xl">
      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto mb-20 max-w-2xl text-center"
      >
        <span className="inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-primary">
          <span className="h-px w-10 bg-primary" />
          Testimonials
          <span className="h-px w-10 bg-primary" />
        </span>
        <h2 className="font-display mt-6 text-5xl font-black leading-[1.05] tracking-tight text-white md:text-6xl">
          Loved by{" "}
          <span className="bg-gradient-to-r from-primary via-orange-400 to-accent bg-clip-text text-transparent">
            thousands
          </span>
        </h2>
        <div className="mt-6 flex items-center justify-center gap-3">
          <Stars rating={5} />
          <span className="text-sm text-gray-400">
            <span className="font-bold text-white">4.8</span> from 2,000+ orders
          </span>
        </div>
      </motion.div>

      {/* Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:items-stretch lg:gap-8">
        {reviews.map((r, i) => (
          <ReviewCard key={r.name} r={r} index={i} featured={i === 1} />
        ))}
      </div>
    </div>
  </section>
);

export default CustomerReviews;
