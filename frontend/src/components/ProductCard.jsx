import { motion } from 'framer-motion';
import { FiPlus, FiShoppingCart } from 'react-icons/fi';
import { useAppContext } from '../context/AppContext';
import { formatPrice, getImageUrl, truncateText } from '../utils/helpers';
import { hoverScale, tapScale } from '../animations/motionVariants';

const ProductCard = ({ product }) => {
  const { addToCart } = useAppContext();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      className="card-glass overflow-hidden group cursor-pointer"
    >
      {/* Image */}
      <div className="relative overflow-hidden h-48">
        <img
          src={getImageUrl(product.image)}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          onError={(e) => {
            e.target.src = `https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop`;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark/60 to-transparent" />
        
        {/* Category Badge */}
        <span className="absolute top-3 left-3 bg-primary/90 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full font-medium">
          {product.category}
        </span>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-display font-semibold text-lg text-white mb-1 group-hover:text-primary transition-colors">
          {product.name}
        </h3>
        <p className="text-gray-400 text-sm mb-3 leading-relaxed">
          {truncateText(product.description, 60)}
        </p>

        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            {formatPrice(product.price)}
          </span>

          <motion.button
            whileHover={hoverScale}
            whileTap={tapScale}
            onClick={(e) => {
              e.stopPropagation();
              addToCart(product);
            }}
            className="bg-primary hover:bg-primary-dark text-white p-3 rounded-xl transition-colors shadow-lg shadow-primary/25"
          >
            <FiPlus size={18} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
