import { motion } from 'framer-motion';

const Loader = () => {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="relative">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 border-4 border-gray-700 border-t-primary rounded-full"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="absolute inset-0 flex items-center justify-center text-lg"
        >
          🍔
        </motion.div>
      </div>
    </div>
  );
};

export default Loader;
