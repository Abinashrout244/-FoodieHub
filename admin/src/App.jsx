import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import AddItem from './pages/AddItem';
import ListItems from './pages/ListItems';
import Orders from './pages/Orders';
import { authAPI } from './services/api';
import toast from 'react-hot-toast';
import './index.css';

const AdminLogin = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await authAPI.login({ email, password });
      if (data.role !== 'admin') {
        toast.error('Access denied. Admin only.');
        return;
      }
      localStorage.setItem('admin_token', data.token);
      onLogin(data);
      toast.success('Welcome, Admin!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-dark">
      <div className="w-full max-w-md bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🍔</span>
          </div>
          <h1 className="font-display text-2xl font-bold text-white">Admin Login</h1>
          <p className="text-gray-400 mt-1">Enter your admin credentials</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-400 text-sm mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@foodiehub.com"
              className="input-field"
              required
            />
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="input-field"
              required
            />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

function App() {
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      setAdmin({ token });
    }
  }, []);

  if (!admin) {
    return (
      <>
        <Toaster
          position="top-center"
          toastOptions={{
            style: { background: '#1A1A2E', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' },
          }}
        />
        <AdminLogin onLogin={setAdmin} />
      </>
    );
  }

  return (
    <BrowserRouter>
      <Toaster
        position="top-center"
        toastOptions={{
          style: { background: '#1A1A2E', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' },
          success: { iconTheme: { primary: '#FF6B35', secondary: '#fff' } },
        }}
      />
      <div className="flex min-h-screen">
        <Sidebar />
     <div className="flex-1 md:ml-64">
          <Navbar />
          <main className="pt-16 p-6">
            <Routes>
              <Route path="/" element={<Navigate to="/add" replace />} />
              <Route path="/add" element={<AddItem />} />
              <Route path="/list" element={<ListItems />} />
              <Route path="/orders" element={<Orders />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
