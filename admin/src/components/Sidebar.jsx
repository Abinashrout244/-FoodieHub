import { NavLink } from "react-router-dom";
import {
  FiPlusCircle,
  FiList,
  FiShoppingBag,
  FiLogOut,
  FiMenu,
  FiX,
  FiHome,
  FiCoffee,
} from "react-icons/fi";
import { useState } from "react";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { name: "Home", path: "/", icon: <FiHome size={18} />, end: true },
    { name: "Restaurants", path: "/restaurants", icon: <FiCoffee size={18} /> },
    { name: "Add Items", path: "/add", icon: <FiPlusCircle size={18} /> },
    { name: "List Items", path: "/list", icon: <FiList size={18} /> },
    { name: "Orders", path: "/orders", icon: <FiShoppingBag size={18} /> },
  ];

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    window.location.reload();
  };

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed top-4 left-4 z-50 p-2.5 rounded-xl bg-dark-lighter border border-white/10 text-white shadow-lg shadow-black/30 hover:bg-white/10 transition md:hidden ${
          isOpen ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        <FiMenu size={20} />
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-dark-lighter border-r border-white/10 flex flex-col z-50 transform transition-transform duration-300 shadow-2xl shadow-black/40
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0`}
      >
        {/* Close (mobile) */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-5 right-4 p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition md:hidden"
        >
          <FiX size={18} />
        </button>

        {/* Logo */}
        <div className="px-5 py-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 ring-1 ring-white/10">
              <span className="text-xl">🍔</span>
            </div>
            <div className="leading-tight">
              <span className="font-display text-lg font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                FoodieHub
              </span>
              <span className="block text-gray-500 text-[11px] font-medium uppercase tracking-widest">
                Admin Panel
              </span>
            </div>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.end}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-primary/15 to-transparent text-white"
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {/* Active indicator bar */}
                  <span
                    className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 rounded-r-full bg-gradient-to-b from-primary to-accent transition-all duration-200 ${
                      isActive ? "h-6 opacity-100" : "h-0 opacity-0"
                    }`}
                  />
                  {/* Icon tile */}
                  <span
                    className={`flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-200 ${
                      isActive
                        ? "bg-primary/20 text-primary ring-1 ring-primary/30"
                        : "bg-white/5 text-gray-400 group-hover:bg-white/10 group-hover:text-white"
                    }`}
                  >
                    {link.icon}
                  </span>
                  <span>{link.name}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="group flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-sm font-medium text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200"
          >
            <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-white/5 group-hover:bg-red-500/15 transition-all duration-200">
              <FiLogOut size={18} />
            </span>
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
