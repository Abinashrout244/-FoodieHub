import { motion } from "framer-motion";
import {
  FiTruck,
  FiHeart,
  FiSmartphone,
  FiShield,
  FiArrowUpRight,
} from "react-icons/fi";

const features = [
  {
    icon: FiTruck,
    title: "Fast Delivery",
    text: "Hot food at your door in 30 minutes or less, with live tracking from kitchen to doorstep.",
    tag: "30 min",
  },
  {
    icon: FiHeart,
    title: "Fresh Ingredients",
    text: "Locally sourced produce, prepared the moment you place your order.",
    tag: "Made fresh",
  },
  {
    icon: FiSmartphone,
    title: "Easy Ordering",
    text: "Browse, pick and order in a few taps. Follow every step of your order live.",
    tag: "3 taps",
  },
  {
    icon: FiShield,
    title: "Safe & Secure",
    text: "Hygienic kitchens, contactless delivery and protected payments on every order.",
    tag: "100% safe",
  },
];

const WhyChooseUs = () => (
  <section className="relative overflow-x-clip py-28">
    {" "}
    {/* Ambient glow */}
    <div className="pointer-events-none absolute left-1/2 top-1/3 h-[32rem] w-[32rem] -translate-x-1/2 rounded-full bg-primary/10 blur-[140px]" />
    <div className="relative mx-auto grid max-w-7xl gap-16 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24 lg:px-8">
      {/* LEFT: sticky heading */}
      <div className="self-start lg:sticky lg:top-32">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-primary">
            <span className="h-px w-10 bg-primary" />
            Why FoodieHub
          </span>

          <h2 className="font-display mt-6 text-5xl font-black leading-[1.05] tracking-tight text-white md:text-6xl">
            Food that
            <br />
            <span className="bg-gradient-to-r from-primary via-orange-400 to-accent bg-clip-text text-transparent">
              feels right.
            </span>
          </h2>

          <p className="mt-6 max-w-sm text-base font-light leading-relaxed text-gray-400">
            Everything you love about great food, delivered with care, speed and
            a little obsession with detail.
          </p>

          <a
            href="#menu"
            className="group mt-10 inline-flex items-center gap-3 border-b border-white/20 pb-2 text-sm font-semibold text-white transition-colors hover:border-primary hover:text-primary"
          >
            Start your order
            <FiArrowUpRight className="transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" />
          </a>
        </motion.div>
      </div>

      {/* RIGHT: numbered rows */}
      <div className="border-t border-white/10">
        {features.map(({ icon: Icon, title, text, tag }, i) => (
          <motion.div
            key={title}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{
              duration: 0.7,
              delay: i * 0.08,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="group relative cursor-default border-b border-white/10 py-9 sm:py-11"
          >
            {/* Hover wash */}
            <div className="pointer-events-none absolute inset-y-0 -inset-x-4 rounded-2xl bg-gradient-to-r from-primary/[0.07] to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

            {/* Sweeping gradient line */}
            <span className="absolute -bottom-px left-0 h-px w-full origin-left scale-x-0 bg-gradient-to-r from-primary via-orange-400 to-accent transition-transform duration-700 ease-out group-hover:scale-x-100" />

            <div className="relative flex items-start gap-5 sm:gap-8">
              {/* Outlined number */}
              <span className="font-display select-none text-5xl font-black leading-none text-transparent transition-all duration-500 [-webkit-text-stroke:1px_rgba(255,255,255,0.25)] group-hover:[-webkit-text-stroke:1px_rgba(249,115,22,0.9)] sm:text-7xl">
                0{i + 1}
              </span>

              <div className="min-w-0 flex-1 pt-1 transition-transform duration-500 group-hover:translate-x-2">
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                    {title}
                  </h3>
                  <span className="rounded-full border border-white/10 px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-gray-400 transition-colors duration-300 group-hover:border-primary/40 group-hover:text-primary">
                    {tag}
                  </span>
                </div>
                <p className="mt-3 max-w-lg text-sm leading-relaxed text-gray-500 transition-colors duration-300 group-hover:text-gray-300 sm:text-base">
                  {text}
                </p>
              </div>

              {/* Icon */}
              <span className="hidden h-14 w-14 shrink-0 items-center justify-center rounded-full border border-white/10 text-gray-500 transition-all duration-500 group-hover:rotate-12 group-hover:border-transparent group-hover:bg-gradient-to-br group-hover:from-primary group-hover:to-accent group-hover:text-white group-hover:shadow-[0_10px_30px_-5px] group-hover:shadow-primary/60 sm:flex">
                <Icon size={22} />
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default WhyChooseUs;
