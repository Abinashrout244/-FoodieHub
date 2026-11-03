import { FiUser } from "react-icons/fi";

const Navbar = () => {
  return (
    <header className="fixed top-0 left-12 md:left-64 right-0 h-16 bg-dark/70 backdrop-blur-2xl border-b border-white/[0.08] shadow-lg shadow-black/20 flex items-center justify-between px-4 md:px-8 z-30">
      {/* Soft glowing accent line along the bottom edge */}
      <span className="pointer-events-none absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

      {/* Title (hidden on mobile) */}
      <div className="hidden sm:flex items-center gap-3">
        <span className="w-1 h-6 rounded-full bg-gradient-to-b from-primary to-accent" />
        <h2 className="font-display text-lg font-semibold tracking-tight text-white">
          Dashboard
        </h2>
      </div>

      {/* Profile pill */}
      <div className="group flex items-center gap-3 ml-auto pl-1.5 pr-4 py-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-primary/30 transition-all duration-300 cursor-pointer">
        <div className="relative">
          <div className="w-9 h-9 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center shadow-lg shadow-primary/30 ring-2 ring-white/10 group-hover:ring-primary/40 transition-all duration-300">
            <FiUser className="text-white" size={16} />
          </div>
          {/* Online dot */}
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-dark" />
        </div>
        <span className="text-sm font-medium text-gray-200 group-hover:text-white transition-colors">
          Admin
        </span>
      </div>
    </header>
  );
};

export default Navbar;
