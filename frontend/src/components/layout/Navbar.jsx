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
    <header className="sticky top-0 z-50 border-b border-white/40 bg-[var(--surface)]/90 backdrop-blur-xl">
      <nav className="mx-auto max-w-7xl px-4 py-3 md:px-8">
        <div className="flex items-center justify-between">
        <Link to="/" className="text-xl font-semibold tracking-wide text-[var(--text)]">
          Pratham <span className="text-[var(--accent)]">Furnishing</span>
        </Link>
        <div className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `text-sm font-medium transition-colors ${
                  isActive ? "text-[var(--accent)]" : "text-[var(--muted)] hover:text-[var(--text)]"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>
        <ThemeToggle />
        </div>

        <div className="mt-3 flex items-center gap-4 overflow-x-auto pb-1 md:hidden">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                  isActive ? "bg-[var(--accent)] text-white" : "bg-white/70 text-[var(--muted)]"
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
