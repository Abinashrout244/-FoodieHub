import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import MainLayout from "../layouts/MainLayout";
import { useAppContext } from "../context/AppContext";

const Home = lazy(() => import("../pages/Home"));
const About = lazy(() => import("../pages/About"));
const Cart = lazy(() => import("../pages/Cart"));
const Checkout = lazy(() => import("../pages/Checkout"));
const Login = lazy(() => import("../pages/Login"));
const Profile = lazy(() => import("../pages/Profile"));
const PrivacyPolicy = lazy(() => import("../pages/PrivacyPolicy"));
const TermsConditions = lazy(() => import("../pages/TermsConditions"));
const RefundPolicy = lazy(() => import("../pages/RefundPolicy"));
const ContactUs = lazy(() => import("../pages/ContactUs"));
const Restaurants = lazy(() => import("../pages/Restaurants"));
const RestaurantDetail = lazy(() => import("../pages/RestaurantDetail"));

const ProtectedRoute = ({ children }) => {
  const { user } = useAppContext();
  if (!user) {
    return (
      <Navigate
        to="/login"
        state={{ from: window.location.pathname }}
        replace
      />
    );
  }
  return children;
};

const AppRoutes = () => {
  const { isAppLoaded } = useAppContext();

  if (!isAppLoaded) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-dark text-white">
        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent shadow-lg shadow-primary/20">
          <span className="text-3xl" aria-hidden="true">🍔</span>
        </div>
        <h1 className="font-display text-2xl font-bold tracking-tight">
          Foodie<span className="text-primary">Hub</span>
        </h1>
        <div
          className="mt-6 h-8 w-8 animate-spin rounded-full border-2 border-white/15 border-t-primary"
          role="status"
          aria-label="Loading"
        />
        <p className="mt-3 text-sm text-gray-400">Getting things ready...</p>
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <Suspense
        fallback={
          <div className="flex min-h-screen flex-col items-center justify-center bg-dark text-white">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/15 border-t-primary" />
            <p className="mt-3 text-sm text-gray-400">Loading page...</p>
          </div>
        }
      >
        <Routes>
          <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-conditions" element={<TermsConditions />} />
          <Route path="/refund-policy" element={<RefundPolicy />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/restaurants" element={<Restaurants />} />
          <Route path="/restaurants/:id" element={<RestaurantDetail />} />

          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            }
          />
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
      </Suspense>
    </AnimatePresence>
  );
};

export default AppRoutes;
