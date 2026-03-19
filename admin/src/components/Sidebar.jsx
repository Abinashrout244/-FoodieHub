import { NavLink } from 'react-router-dom';
import { FiPlusCircle, FiList, FiShoppingBag, FiLogOut, FiMenu, FiX } from 'react-icons/fi';
import { useState } from 'react';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { name: 'Add Items', path: '/add', icon: <FiPlusCircle size={20} /> },
    { name: 'List Items', path: '/list', icon: <FiList size={20} /> },
    { name: 'Orders', path: '/orders', icon: <FiShoppingBag size={20} /> },
  ];

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    window.location.reload();
  };

  return (
    <>
      {/* ✅ TOGGLE BUTTON (clean switch) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-gray-900 text-white md:hidden"
      >
        {isOpen ? <FiX size={22} /> : <FiMenu size={22} />}
      </button>

      {/* ✅ OVERLAY */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
        />
      )}

      {/* ✅ SIDEBAR */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-dark-lighter border-r border-white/10 flex flex-col z-50 transform transition-transform duration-300
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0`}
      >
        {/* ✅ CLOSE ICON INSIDE SIDEBAR (mobile only) */}
<div className="absolute top-4 right-4 md:hidden">
  <button
    onClick={() => setIsOpen(false)}
    className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition"
  >
    <FiX size={20} />
  </button>
</div>
        {/* Logo */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center">
              <span className="text-xl">🍔</span>
            </div>
            <div>
              <span className="font-display text-lg font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                FoodieHub
              </span>
              <span className="block text-gray-500 text-xs">Admin Panel</span>
            </div>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 p-4 space-y-2">
          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                  isActive
                    ? 'bg-primary/10 text-primary border border-primary/20'
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              {link.icon}
              <span className="font-medium">{link.name}</span>
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-all"
          >
            <FiLogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;