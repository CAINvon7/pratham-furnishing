import { Link } from "react-router-dom";
import {
  buyingSteps,
  businessInfo,
  categories,
  sellingPoints,
  testimonials,
  trustBadges,
  whatsappLink,
} from "../data/products";
import ProductCard from "../components/product/ProductCard";
import InquiryForm from "../components/common/InquiryForm";

const HomePage = ({ products, productsError, productsLoading }) => {
  return (
    <div className="space-y-32 pb-24">
      {/* Hero Section */}
      <section className="reveal relative min-h-[85vh] flex items-center justify-center rounded-[2.5rem] overflow-hidden border border-[var(--glass-border)] shadow-2xl mt-4">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1615874959474-d609969a20ed?auto=format&fit=crop&w=2000&q=80"
            alt="Premium interior furnishing"
            loading="lazy"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
        </div>

        <div className="relative z-10 w-full max-w-5xl px-6 md:px-12 grid gap-12 md:grid-cols-2 items-center">
          <div className="space-y-8 glass-panel p-8 md:p-12 rounded-3xl">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--accent)] flex items-center gap-2">
                <span className="w-8 h-[1px] bg-[var(--accent)]"></span>
                Local Furnishing Store
              </p>
              <h1 className="text-5xl md:text-6xl font-serif font-medium leading-[1.1] text-white">
                Elevate Your <br />
                <span className="text-gradient italic font-light">Living Space</span>
              </h1>
            </div>
            
            <p className="text-[var(--text-muted)] text-lg leading-relaxed max-w-md">
              Pratham Furnishing helps local customers choose premium curtains, bedsheets, sofa fabrics, and upholstery with custom guidance.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Link to="/collections" className="rounded-full bg-white text-black px-8 py-3.5 text-sm font-semibold hover:bg-[var(--accent)] hover:text-white transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(214,161,90,0.4)]">
                Shop Collections
              </Link>
              {whatsappLink !== "#" ? (
                <a href={whatsappLink} target="_blank" rel="noreferrer" className="rounded-full glass border border-[var(--glass-border)] px-8 py-3.5 text-sm font-semibold text-white hover:bg-white/10 transition-all duration-300">
                  Ask on WhatsApp
                </a>
              ) : (
                <Link to="/contact" className="rounded-full glass border border-[var(--glass-border)] px-8 py-3.5 text-sm font-semibold text-white hover:bg-white/10 transition-all duration-300">
                  Visit Store
                </Link>
              )}
            </div>

            <div className="pt-6 border-t border-[var(--glass-border)] flex items-center gap-6">
              <div className="flex -space-x-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-[var(--surface)] bg-neutral-800 flex items-center justify-center overflow-hidden">
                    <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="Customer" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
              <div className="text-sm">
                <p className="text-white font-medium">Trusted locally</p>
                <p className="text-[var(--text-muted)] text-xs">Serving {businessInfo.city}</p>
              </div>
            </div>
          </div>

          <div className="hidden md:grid gap-4 self-end justify-end">
            {sellingPoints.slice(0, 3).map((point, idx) => (
              <div key={point} className={`glass px-6 py-4 rounded-2xl flex items-center gap-4 transform transition-transform hover:scale-105 ${idx === 1 ? '-translate-x-8' : ''}`}>
                <div className="w-2 h-2 rounded-full bg-[var(--accent)] shadow-[0_0_10px_var(--accent)]"></div>
                <p className="text-sm font-medium text-white">{point}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="reveal max-w-6xl mx-auto w-full">
        <div className="text-center mb-12 space-y-4">
          <h2 className="text-4xl md:text-5xl font-serif text-white">Curated <span className="italic text-[var(--accent)] font-light">Categories</span></h2>
          <p className="text-[var(--text-muted)] max-w-2xl mx-auto">Explore our finest selection of materials crafted for exceptional interiors.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {categories.map((category) => (
            <article key={category.id} className="group relative overflow-hidden rounded-3xl border border-[var(--glass-border)] aspect-[4/5] cursor-pointer">
              <img src={category.image} alt={category.title} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent transition-opacity duration-300"></div>
              <div className="absolute inset-0 p-8 flex flex-col justify-end">
                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <h3 className="text-2xl font-serif text-white mb-2">{category.title}</h3>
                  <p className="text-sm text-white/70 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">{category.description}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="reveal max-w-6xl mx-auto w-full">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-4xl md:text-5xl font-serif text-white mb-4">Latest <span className="italic text-[var(--accent)] font-light">Arrivals</span></h2>
            <p className="text-[var(--text-muted)]">Discover our newest and most popular selections.</p>
          </div>
          <Link to="/collections" className="hidden md:flex items-center gap-2 text-[var(--accent)] hover:text-white transition-colors">
            View All <span className="text-xl">&rarr;</span>
          </Link>
        </div>
        {productsError && (
          <p className="mb-8 rounded-xl glass border-red-500/30 p-4 text-sm text-red-400 text-center">
            {productsError}
          </p>
        )}
        {productsLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, idx) => (
              <article key={`home-skeleton-${idx}`} className="animate-pulse overflow-hidden rounded-3xl glass aspect-[3/4] flex flex-col">
                <div className="flex-1 bg-white/5" />
                <div className="space-y-4 p-6 border-t border-[var(--glass-border)]">
                  <div className="h-4 w-20 rounded bg-white/10" />
                  <div className="h-6 w-3/4 rounded bg-white/10" />
                  <div className="h-5 w-1/2 rounded bg-white/10" />
                </div>
              </article>
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
            {products.slice(0, 3).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl glass p-12 text-center flex flex-col items-center justify-center min-h-[300px]">
            <div className="w-16 h-16 rounded-full glass flex items-center justify-center mb-4 border-[var(--glass-border)]">
              <span className="text-2xl">🛋️</span>
            </div>
            <p className="text-lg font-medium text-white mb-2">No products found</p>
            <p className="text-[var(--text-muted)]">Check back soon for new arrivals.</p>
          </div>
        )}
        <div className="mt-8 text-center md:hidden">
          <Link to="/collections" className="inline-flex items-center gap-2 text-[var(--accent)] hover:text-white transition-colors">
            View All Collections <span className="text-xl">&rarr;</span>
          </Link>
        </div>
      </section>

      <section className="reveal max-w-6xl mx-auto w-full grid gap-6 md:grid-cols-3">
        {buyingSteps.map((step, index) => (
          <article key={step.title} className="group glass-panel rounded-3xl p-8 hover:-translate-y-2 transition-transform duration-300">
            <div className="w-12 h-12 rounded-full glass border-[var(--glass-border)] flex items-center justify-center text-[var(--accent)] font-serif text-xl mb-6">
              0{index + 1}
            </div>
            <h3 className="text-2xl font-serif text-white mb-3 group-hover:text-[var(--accent)] transition-colors">{step.title}</h3>
            <p className="text-[var(--text-muted)] leading-relaxed">{step.description}</p>
          </article>
        ))}
      </section>

      <section className="reveal max-w-6xl mx-auto w-full grid gap-4 sm:grid-cols-2 md:grid-cols-4">
        {trustBadges.map((badge) => (
          <div key={badge} className="glass rounded-2xl p-6 text-center text-sm font-medium text-white/90 hover:bg-white/5 transition-colors border border-[var(--glass-border)] flex items-center justify-center gap-3">
            <div className="w-2 h-2 rounded-full bg-[var(--accent)] shadow-[0_0_8px_var(--accent)]"></div>
            {badge}
          </div>
        ))}
      </section>

      <div className="max-w-6xl mx-auto w-full">
        <InquiryForm
          title="Need help choosing the right furnishing?"
          description="Tell us what room you are decorating and we will recommend suitable fabrics, share pricing, and help you order locally."
          submitLabel="Request pricing"
          source="homepage"
          defaultMessage="Hi, I want help selecting furnishings for my home."
        />
      </div>

      <section className="reveal max-w-6xl mx-auto w-full">
        <div className="text-center mb-12 space-y-4">
          <h2 className="text-4xl md:text-5xl font-serif text-white">Client <span className="italic text-[var(--accent)] font-light">Stories</span></h2>
          <p className="text-[var(--text-muted)]">Hear from our satisfied customers.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((item) => (
            <article key={item.name} className="glass-panel rounded-3xl p-8 relative">
              <span className="absolute top-6 right-6 text-6xl font-serif text-[var(--accent)] opacity-20 leading-none">"</span>
              <p className="text-[var(--text-muted)] leading-relaxed relative z-10 mb-8 italic">"{item.quote}"</p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full glass border-[var(--glass-border)] bg-neutral-800 flex items-center justify-center font-serif text-white">
                  {item.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-white">{item.name}</p>
                  <p className="text-xs text-[var(--accent)]">{item.role}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
