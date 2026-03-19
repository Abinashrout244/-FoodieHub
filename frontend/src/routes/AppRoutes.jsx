import { Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import MainLayout from '../layouts/MainLayout';
import Home from '../pages/Home';
import About from '../pages/About';
import Cart from '../pages/Cart';
import Checkout from '../pages/Checkout';
import Login from '../pages/Login';
import Profile from '../pages/Profile';
import { useAppContext } from '../context/AppContext';

const ProtectedRoute = ({ children }) => {
  const { user } = useAppContext();
  if (!user) {
    return <Navigate to="/login" state={{ from: window.location.pathname }} replace />;
  }
  return children;
};

const AppRoutes = () => {
  return (
    <AnimatePresence mode="wait">
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </AnimatePresence>
  );
};

export default AppRoutes;
