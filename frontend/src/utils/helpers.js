export const formatPrice = (price) => {
  return `₹${price?.toFixed(2) || '0.00'}`;
};

export const getCartTotal = (items) => {
  return items.reduce((total, item) => {
    const price = item.productId?.price || item.price || 0;
    return total + price * item.quantity;
  }, 0);
};

export const getCartCount = (items) => {
  return items.reduce((count, item) => count + item.quantity, 0);
};

export const truncateText = (text, maxLength = 80) => {
  if (!text) return '';
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
};

export const getImageUrl = (imagePath) => {
  if (!imagePath) return '/placeholder-food.jpg';
  if (imagePath.startsWith('http')) return imagePath;
  return `http://localhost:5000${imagePath}`;
};
