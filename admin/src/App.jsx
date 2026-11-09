import { lazy, Suspense, useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import { authAPI } from "./services/api";
import toast from "react-hot-toast";
import "./index.css";
import { MdFastfood } from "react-icons/md";
import { SocketProvider } from "./context/SocketContext";

const AddItem = lazy(() => import("./pages/AddItem"));
const ListItems = lazy(() => import("./pages/ListItems"));
const Orders = lazy(() => import("./pages/Orders"));
const Home = lazy(() => import("./pages/Home"));
const Restaurants = lazy(() => import("./pages/Restaurants"));

const AdminLogin = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await authAPI.login({ email, password });
      if (data.role !== "admin") {
        toast.error("Access denied. Admin only.");
        return;
      }
      localStorage.setItem("admin_token", data.token);
      onLogin(data);
      toast.success("Welcome, Admin!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-dark">
      <div className="w-full max-w-md bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
        <div className="text-center mb-8">
          {/* Logo lockup */}
          <div className="flex items-center justify-center gap-4 mb-7">
            {/* Icon tile */}
            <div className="relative">
              {/* Glow */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary to-accent blur-lg opacity-50" />
              {/* Tile */}
              <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center ring-1 ring-white/25 shadow-xl shadow-primary/30 overflow-hidden">
                {/* Top gloss */}
                <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/30 to-transparent" />
                {/* Corner light */}
                <div className="absolute -bottom-4 -right-4 w-10 h-10 rounded-full bg-black/20 blur-xl" />
                <MdFastfood
                  size={28}
                  className="relative text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.35)]"
                />
              </div>
            </div>

            {/* Wordmark */}
            <div className="text-left leading-none">
              <div className="font-display text-[28px] font-extrabold tracking-tight">
                <span className="text-white">Foodie</span>
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Hub
                </span>
              </div>
              <div className="mt-1.5 flex items-center gap-2">
                <span className="h-px w-5 bg-gradient-to-r from-primary to-transparent" />
                <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-gray-500">
                  Admin Panel
                </span>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-white/15 to-transparent mb-6" />

          <h1 className="font-display text-xl font-semibold text-white">
            Welcome back
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Sign in with your admin credentials
          </p>
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
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

function App() {
  const [admin, setAdmin] = useState(null);
  const [collapsed, setCollapsed] = useState(false);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (token) {
      setAdmin({ token });
    }
    setAuthReady(true);
  }, []);

  if (!authReady) {
    return (
      <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-dark text-white">
        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent shadow-lg shadow-primary/20">
          <MdFastfood size={30} />
        </div>
        <h1 className="font-display text-2xl font-bold tracking-tight">
          Foodie<span className="text-primary">Hub</span>
        </h1>
        <div
          className="mt-6 h-8 w-8 animate-spin rounded-full border-2 border-white/15 border-t-primary"
          role="status"
          aria-label="Loading admin panel"
        />
        <p className="mt-3 text-sm text-gray-400">Loading admin panel...</p>
      </div>
    );
  }

  if (!admin) {
    return (
      <>
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: "#1A1A2E",
              color: "#fff",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "12px",
            },
          }}
        />
        <AdminLogin onLogin={setAdmin} />
      </>
    );
  }

  return (
    <SocketProvider>
      <BrowserRouter>
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: "#1A1A2E",
              color: "#fff",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "12px",
            },
            success: { iconTheme: { primary: "#FF6B35", secondary: "#fff" } },
          }}
        />
        <div className="flex min-h-screen">
          <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
          <div
            className={`flex-1 min-w-0 transition-all duration-300 ${
              collapsed ? "md:ml-20" : "md:ml-64"
            }`}
          >
            <Navbar />
            <main className="pt-16 p-6">
              <Suspense
                fallback={
                  <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-dark text-white">
                    <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent shadow-lg shadow-primary/20">
                      <MdFastfood size={30} />
                    </div>
                    <h1 className="font-display text-2xl font-bold tracking-tight">
                      Foodie<span className="text-primary">Hub</span>
                    </h1>
                    <div
                      className="mt-6 h-8 w-8 animate-spin rounded-full border-2 border-white/15 border-t-primary"
                      role="status"
                      aria-label="Loading admin page"
                    />
                    <p className="mt-3 text-sm text-gray-400">Loading page...</p>
                  </div>
                }
              >
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/add" element={<AddItem />} />
                  <Route path="/list" element={<ListItems />} />
                  <Route path="/orders" element={<Orders />} />
                  <Route path="/restaurants" element={<Restaurants />} />
                </Routes>
              </Suspense>
            </main>
          </div>
        </div>
      </BrowserRouter>
    </SocketProvider>
  );
}

export default App;
