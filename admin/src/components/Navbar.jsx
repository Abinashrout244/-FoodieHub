import { FiUser } from 'react-icons/fi';

const Navbar = () => {
  return (
    <header className="fixed top-0 left-12 md:left-64 right-0 h-16 bg-dark/80 backdrop-blur-xl border-b border-white/10 flex items-center justify-between px-4 md:px-6 z-30">
      
      {/* ✅ Hide only on mobile */}
      <h2 className="hidden sm:block font-display text-lg font-semibold text-white">
        Dashboard
      </h2>

      <div className="flex items-center gap-3 ml-auto">
        <div className="w-9 h-9 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center">
          <FiUser className="text-white" size={16} />
        </div>
        <span className="text-gray-300 text-sm font-medium">Admin</span>
      </div>

    </header>
  );
};

export default Navbar;