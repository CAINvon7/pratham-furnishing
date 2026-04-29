import { Link, NavLink } from "react-router-dom";
import ThemeToggle from "../common/ThemeToggle";

const navItems = [
  { label: "Home", to: "/" },
  { label: "Collections", to: "/collections" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" }
];

const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--glass-border)] glass">
      <nav className="mx-auto max-w-7xl px-4 py-4 md:px-8">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-serif font-semibold tracking-wide text-white">
            Pratham<span className="text-[var(--accent)] font-light italic">Furnishing</span>
          </Link>
          <div className="hidden items-center gap-8 md:flex">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `text-sm tracking-wide transition-all duration-300 relative group ${
                    isActive ? "text-[var(--accent)] font-medium" : "text-[var(--text-muted)] hover:text-white"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {item.label}
                    <span className={`absolute -bottom-1 left-0 h-[1px] bg-[var(--accent)] transition-all duration-300 ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
                  </>
                )}
              </NavLink>
            ))}
            <Link to="/contact" className="rounded-full bg-gradient-to-r from-[var(--accent)] to-amber-700 px-6 py-2.5 text-sm font-medium text-white shadow-[0_0_15px_rgba(214,161,90,0.3)] hover:shadow-[0_0_25px_rgba(214,161,90,0.5)] transition-all duration-300">
              Book Visit
            </Link>
          </div>
          <ThemeToggle />
        </div>

        <div className="mt-4 flex items-center gap-3 overflow-x-auto pb-2 md:hidden">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `rounded-full px-4 py-2 text-xs tracking-wide transition-colors border ${
                  isActive ? "bg-[var(--accent)]/20 border-[var(--accent)] text-[var(--accent)]" : "glass border-transparent text-[var(--text-muted)]"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
