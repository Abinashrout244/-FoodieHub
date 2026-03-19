import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer, staggerItem, pageTransition } from '../animations/motionVariants';
import { FiHeart, FiTruck, FiShield, FiStar } from 'react-icons/fi';

const features = [
  {
    icon: <FiTruck size={28} />,
    title: 'Fast Delivery',
    description: 'Get your food delivered in under 30 minutes, hot and fresh.',
    color: 'from-blue-500 to-blue-600',
  },
  {
    icon: <FiShield size={28} />,
    title: 'Safe & Hygienic',
    description: 'All our restaurant partners follow strict safety guidelines.',
    color: 'from-green-500 to-green-600',
  },
  {
    icon: <FiStar size={28} />,
    title: 'Top Quality',
    description: 'Only the best restaurants with highest ratings make our list.',
    color: 'from-yellow-500 to-yellow-600',
  },
  {
    icon: <FiHeart size={28} />,
    title: 'Made with Love',
    description: 'Every dish is prepared with passion and the finest ingredients.',
    color: 'from-red-500 to-red-600',
  },
];

const About = () => {
  return (
    <motion.div {...pageTransition} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        className="text-center mb-16"
      >
        <span className="inline-block bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-4 border border-primary/20">
          About Us
        </span>
        <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
          We Deliver <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Happiness</span>
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
          FoodieHub is your go-to platform for ordering delicious food from the best restaurants.
          We connect food lovers with amazing culinary experiences, delivering joy to your doorstep.
        </p>
      </motion.div>

      {/* Image + Story */}
      <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/10 rounded-3xl blur-xl" />
            <img
              src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=400&fit=crop"
              alt="Our Kitchen"
              className="relative w-full h-80 object-cover rounded-3xl border border-white/10"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-display text-3xl font-bold text-white mb-4">Our Story</h2>
          <p className="text-gray-400 leading-relaxed mb-4">
            Founded in 2024, FoodieHub started with a simple idea: make great food accessible to everyone.
            What began as a small delivery service has grown into a platform connecting thousands of restaurants
            with food enthusiasts across the city.
          </p>
          <p className="text-gray-400 leading-relaxed mb-6">
            We believe that food is more than just sustenance — it's an experience. That's why we partner
            only with restaurants that share our passion for quality, taste, and innovation.
          </p>
          <div className="flex gap-6">
            {[
              { value: '500+', label: 'Restaurants' },
              { value: '50K+', label: 'Orders' },
              { value: '4.8', label: 'Rating' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-bold text-primary">{stat.value}</div>
                <div className="text-gray-500 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Features */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <h2 className="font-display text-3xl font-bold text-white text-center mb-10">
          Why Choose <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Us</span>
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              variants={staggerItem}
              whileHover={{ y: -8 }}
              className="card-glass p-6 text-center group"
            >
              <div className={`w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                {feature.icon}
              </div>
              <h3 className="font-display font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default About;
