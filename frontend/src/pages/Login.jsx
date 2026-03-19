import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiUser, FiEye, FiEyeOff } from 'react-icons/fi';
import { useAppContext } from '../context/AppContext';
import { pageTransition } from '../animations/motionVariants';
import toast from 'react-hot-toast';

const Login = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const { login, signup } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/';

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignup) {
        if (!formData.name || !formData.email || !formData.password) {
          toast.error('Please fill all fields');
          return;
        }
        if (formData.password.length < 6) {
          toast.error('Password must be at least 6 characters');
          return;
        }
        await signup(formData);
      } else {
        if (!formData.email || !formData.password) {
          toast.error('Please fill all fields');
          return;
        }
        await login({ email: formData.email, password: formData.password });
      }
      navigate(from);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div {...pageTransition} className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Glass Card */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="card-glass p-8"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🍔</span>
            </div>
            <h1 className="font-display text-2xl font-bold text-white">
              {isSignup ? 'Create Account' : 'Welcome Back'}
            </h1>
            <p className="text-gray-400 mt-1">
              {isSignup ? 'Sign up to start ordering' : 'Login to your account'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignup && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
              >
                <label className="block text-gray-400 text-sm mb-1">Full Name</label>
                <div className="relative">
                  <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="input-field pl-10"
                  />
                </div>
              </motion.div>
            )}

            <div>
              <label className="block text-gray-400 text-sm mb-1">Email</label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="input-field pl-10"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-1">Password</label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="input-field pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                >
                  {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="btn-primary w-full disabled:opacity-50"
            >
              {loading ? 'Please wait...' : isSignup ? 'Sign Up' : 'Login'}
            </motion.button>
          </form>

          {/* Toggle */}
          <div className="text-center mt-6">
            <p className="text-gray-400 text-sm">
              {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button
                onClick={() => setIsSignup(!isSignup)}
                className="text-primary hover:text-accent font-semibold transition-colors"
              >
                {isSignup ? 'Login' : 'Sign Up'}
              </button>
            </p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Login;
