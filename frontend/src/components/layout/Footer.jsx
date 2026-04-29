import { Link } from "react-router-dom";
import { businessInfo } from "../../data/products";

const Footer = () => {
  return (
    <footer className="mt-24 border-t border-[var(--glass-border)] glass py-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50 pointer-events-none"></div>
      <div className="mx-auto max-w-7xl px-4 md:px-8 relative z-10">
        <div className="grid gap-12 md:grid-cols-4">
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="text-3xl font-serif font-semibold tracking-wide text-white block">
              Pratham<span className="text-[var(--accent)] font-light italic">Furnishing</span>
            </Link>
            <p className="text-[var(--text-muted)] max-w-md leading-relaxed">
              Curating premium curtains, bedsheets, sofa fabrics, and upholstery materials with exceptional craftsmanship.
            </p>
            <div className="pt-4 flex gap-4">
              <span className="w-10 h-10 rounded-full border border-[var(--glass-border)] flex items-center justify-center text-[var(--text-muted)] hover:text-white hover:border-[var(--accent)] transition-all cursor-pointer">IG</span>
              <span className="w-10 h-10 rounded-full border border-[var(--glass-border)] flex items-center justify-center text-[var(--text-muted)] hover:text-white hover:border-[var(--accent)] transition-all cursor-pointer">FB</span>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-serif text-lg text-white">Quick Links</h3>
            <ul className="space-y-2 text-sm text-[var(--text-muted)]">
              <li><Link to="/collections" className="hover:text-[var(--accent)] transition-colors">Collections</Link></li>
              <li><Link to="/about" className="hover:text-[var(--accent)] transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-[var(--accent)] transition-colors">Contact</Link></li>
              <li><Link to="/store-dashboard" className="hover:text-[var(--accent)] transition-colors">Admin Portal</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-serif text-lg text-white">Visit Us</h3>
            <div className="space-y-2 text-sm text-[var(--text-muted)]">
              <p>{businessInfo.address}</p>
              <p className="pt-2">Serving {businessInfo.city}</p>
            </div>
          </div>
        </div>
        
        <div className="mt-16 pt-8 border-t border-[var(--glass-border)] text-center text-xs text-[var(--text-muted)]">
          <p>&copy; {new Date().getFullYear()} Pratham Furnishing. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
