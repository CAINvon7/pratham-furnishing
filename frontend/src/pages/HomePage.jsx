import { Link } from "react-router-dom";
import { categories, products, testimonials, trustBadges, whatsappLink } from "../data/products";
import ProductCard from "../components/product/ProductCard";

const HomePage = () => {
  return (
    <div className="space-y-20">
      <section className="reveal grid gap-8 rounded-3xl bg-[var(--surface)] p-8 shadow-xl md:grid-cols-2 md:p-12">
        <div className="space-y-6">
          <p className="text-sm uppercase tracking-[0.2em] text-[var(--accent)]">Premium Home Furnishing</p>
          <h1 className="text-4xl font-semibold leading-tight text-[var(--text)] md:text-5xl">
            Transform Your Home with Premium Furnishings
          </h1>
          <p className="text-[var(--muted)]">
            Explore elegant curtains, bedsheets, and upholstery materials crafted for stylish homes and design studios.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to="/collections" className="rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-white">
              Explore Collection
            </Link>
            <a href={whatsappLink} target="_blank" rel="noreferrer" className="rounded-full border border-[var(--border)] px-6 py-3 text-sm font-semibold text-[var(--text)]">
              Contact on WhatsApp
            </a>
          </div>
        </div>
        <img
          src="https://images.unsplash.com/photo-1615874959474-d609969a20ed?auto=format&fit=crop&w=1200&q=80"
          alt="Premium interior furnishing"
          loading="lazy"
          className="h-full min-h-80 w-full rounded-2xl object-cover"
        />
      </section>

      <section className="reveal">
        <h2 className="mb-6 text-3xl font-semibold text-[var(--text)]">Featured Categories</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {categories.map((category) => (
            <article key={category.id} className="overflow-hidden rounded-2xl border border-[var(--border)] bg-white/70">
              <img src={category.image} alt={category.title} loading="lazy" className="h-52 w-full object-cover" />
              <div className="space-y-2 p-5">
                <h3 className="text-xl font-semibold text-[var(--text)]">{category.title}</h3>
                <p className="text-sm text-[var(--muted)]">{category.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="reveal">
        <h2 className="mb-6 text-3xl font-semibold text-[var(--text)]">Popular Picks</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {products.slice(0, 3).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="reveal grid gap-5 rounded-2xl border border-[var(--border)] bg-white/70 p-6 md:grid-cols-4">
        {trustBadges.map((badge) => (
          <div key={badge} className="rounded-xl bg-[var(--surface)] p-4 text-center text-sm font-semibold text-[var(--text)]">
            {badge}
          </div>
        ))}
      </section>

      <section className="reveal">
        <h2 className="mb-6 text-3xl font-semibold text-[var(--text)]">What Customers Say</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((item) => (
            <article key={item.name} className="rounded-2xl border border-[var(--border)] bg-white/75 p-6">
              <p className="text-sm leading-relaxed text-[var(--muted)]">"{item.quote}"</p>
              <p className="mt-4 font-semibold text-[var(--text)]">{item.name}</p>
              <p className="text-xs text-[var(--muted)]">{item.role}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
