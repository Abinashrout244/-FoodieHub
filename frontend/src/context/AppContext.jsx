import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, productAPI, cartAPI } from '../services/api';
import toast from 'react-hot-toast';
import dummyProducts from '../utils/dummyData';

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Check for stored auth on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
      fetchCart();
    }
    // Load local cart for guests
    const localCart = localStorage.getItem('guestCart');
    if (localCart && !token) {
      setCart(JSON.parse(localCart));
    }
    fetchProducts();
  }, []);

  // Fetch products (uses dummy data as fallback)
  // const fetchProducts = async (category) => {
  //   try {
  //     setLoading(true);
  //     const cat = category === 'All' ? '' : category;
  //     const { data } = await productAPI.getAll(cat);
  //     if (data && data.length > 0) {
  //       setProducts(data);
  //     } else {
  //       // Use dummy data when backend has no products yet
  //       const filtered = cat
  //         ? dummyProducts.filter((p) => p.category === cat)
  //         : dummyProducts;
  //       setProducts(filtered);
  //     }
  //   } catch (error) {
  //     console.error('Failed to fetch products, using dummy data:', error);
  //     // Fallback to dummy data if API fails
  //     const cat = category === 'All' ? '' : category;
  //     const filtered = cat
  //       ? dummyProducts.filter((p) => p.category === cat)
  //       : dummyProducts;
  //     setProducts(filtered);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  
  const fetchProducts = async (category) => {
    try {
      setLoading(true);
      const cat = category === 'All' ? '' : category;
      
      // 1. Call your actual API
      const { data } = await productAPI.getAll(cat);
      
      // 2. If data exists (even if it's an empty array from the DB), use it
      // We removed the "data.length > 0" check so it doesn't jump to dummy data
      if (data) {
        setProducts(data);
      }
    } catch (error) {
      console.error('Failed to fetch products from DB:', error);
      console.error(error);
      setProducts([]);
      toast.error("Failed to load products. Please try again.");
    
    } finally {
      setLoading(false);
    }
  };

  // Fetch cart from server (logged-in users)
  const fetchCart = async () => {
    try {
      const { data } = await cartAPI.get();
      setCart(data.items || []);
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    }
  };

  // Login
  const login = async (credentials) => {
    const { data } = await authAPI.login(credentials);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data));
    setUser(data);

    // Sync guest cart to server
    const guestCart = JSON.parse(localStorage.getItem('guestCart') || '[]');
    if (guestCart.length > 0) {
      for (const item of guestCart) {
        try {
          await cartAPI.add(item.productId?._id || item.productId, item.quantity);
        } catch (e) {
          // ignore sync errors
        }
      }
      localStorage.removeItem('guestCart');
    }

    await fetchCart();
    toast.success(`Welcome back, ${data.name}!`);
    return data;
  };

  // Signup
  const signup = async (userData) => {
    const { data } = await authAPI.signup(userData);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data));
    setUser(data);
    toast.success(`Welcome, ${data.name}!`);
    return data;
  };

  // Logout
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setCart([]);
    toast.success('Logged out successfully');
  };

  // Add to cart
  const addToCart = async (product) => {
    if (user) {
      try {
        const { data } = await cartAPI.add(product._id, 1);
        setCart(data.items || []);
        toast.success('Added to cart!');
      } catch (error) {
        toast.error('Failed to add to cart');
      }
    } else {
      // Guest cart (local storage)
      const existing = cart.find(
        (item) => (item.productId?._id || item.productId) === product._id
      );
      let newCart;
      if (existing) {
        newCart = cart.map((item) =>
          (item.productId?._id || item.productId) === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        newCart = [...cart, { productId: product, quantity: 1 }];
      }
      setCart(newCart);
      localStorage.setItem('guestCart', JSON.stringify(newCart));
      toast.success('Added to cart!');
    }
  };

  // Update cart item quantity
  const updateCartQuantity = async (productId, quantity) => {
    if (user) {
      try {
        const { data } = await cartAPI.update(productId, quantity);
        setCart(data.items || []);
      } catch (error) {
        toast.error('Failed to update cart');
      }
    } else {
      let newCart;
      if (quantity <= 0) {
        newCart = cart.filter(
          (item) => (item.productId?._id || item.productId) !== productId
        );
      } else {
        newCart = cart.map((item) =>
          (item.productId?._id || item.productId) === productId
            ? { ...item, quantity }
            : item
        );
      }
      setCart(newCart);
      localStorage.setItem('guestCart', JSON.stringify(newCart));
    }
  };

  // Remove from cart
  const removeFromCart = async (productId) => {
    if (user) {
      try {
        const { data } = await cartAPI.remove(productId);
        setCart(data.items || []);
        toast.success('Removed from cart');
      } catch (error) {
        toast.error('Failed to remove item');
      }
    } else {
      const newCart = cart.filter(
        (item) => (item.productId?._id || item.productId) !== productId
      );
      setCart(newCart);
      localStorage.setItem('guestCart', JSON.stringify(newCart));
      toast.success('Removed from cart');
    }
  };

  // Clear cart
  const clearCart = async () => {
    if (user) {
      try {
        await cartAPI.clear();
      } catch (e) {}
    }
    setCart([]);
    localStorage.removeItem('guestCart');
  };

  const value = {
    user,
    products,
    cart,
    loading,
    selectedCategory,
    setSelectedCategory,
    fetchProducts,
    login,
    signup,
    logout,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    fetchCart,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContext;
