import { useMemo, useState } from "react";
import FilterBar from "../components/product/FilterBar";
import ProductCard from "../components/product/ProductCard";
import SearchBar from "../components/common/SearchBar";

const CollectionsPage = ({ products, productsError, productsLoading }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({ fabricType: "", color: "", priceRange: "" });

  const options = useMemo(() => {
    return {
      fabricTypes: [...new Set(products.map((item) => item.fabricType))],
      colors: [...new Set(products.map((item) => item.color))]
    };
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesQuery = product.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = filters.fabricType ? product.fabricType === filters.fabricType : true;
      const matchesColor = filters.color ? product.color === filters.color : true;
      const matchesPrice =
        filters.priceRange === ""
          ? true
          : filters.priceRange === "under-2000"
            ? product.price > 0 && product.price < 2000
            : filters.priceRange === "2000-3000"
              ? product.price >= 2000 && product.price <= 3000
              : product.price > 3000;

      return matchesQuery && matchesType && matchesColor && matchesPrice;
    });
  }, [filters, searchQuery, products]);

  return (
    <div className="space-y-10 max-w-6xl mx-auto pb-24">
      <header className="reveal space-y-4 text-center py-12 relative overflow-hidden rounded-3xl glass-panel border-[var(--glass-border)]">
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/90 z-0"></div>
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-serif text-white mb-4">Our <span className="italic text-[var(--accent)] font-light">Collections</span></h1>
          <p className="text-[var(--text-muted)] max-w-xl mx-auto">Explore premium curtains, bedsheets, sofa fabrics and upholstery materials carefully curated for your home.</p>
        </div>
      </header>

      {productsError && (
        <p className="rounded-xl glass border-red-500/30 p-4 text-sm text-red-400 text-center">
          {productsError}
        </p>
      )}

      <div className="glass p-6 rounded-3xl border border-[var(--glass-border)] space-y-6">
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
        <FilterBar filters={filters} setFilters={setFilters} options={options} />
      </div>

      {productsLoading && (
        <section className="reveal grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, idx) => (
            <article key={`skeleton-${idx}`} className="animate-pulse overflow-hidden rounded-3xl glass aspect-[3/4] flex flex-col">
              <div className="flex-1 bg-white/5" />
              <div className="space-y-4 p-6 border-t border-[var(--glass-border)]">
                <div className="h-4 w-20 rounded bg-white/10" />
                <div className="h-6 w-3/4 rounded bg-white/10" />
                <div className="h-5 w-1/2 rounded bg-white/10" />
                <div className="h-4 w-1/3 rounded bg-white/10" />
              </div>
            </article>
          ))}
        </section>
      )}

      <section className="reveal grid gap-6 sm:grid-cols-2 md:grid-cols-3">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </section>
      
      {!productsLoading && filteredProducts.length === 0 && (
        <div className="rounded-3xl glass p-16 text-center flex flex-col items-center justify-center border border-[var(--glass-border)]">
          <div className="w-20 h-20 rounded-full glass flex items-center justify-center mb-6 border-[var(--glass-border)] text-white/20">
            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <p className="text-xl font-serif text-white mb-2">No products found</p>
          <p className="text-[var(--text-muted)]">Try adjusting your filters or search query.</p>
        </div>
      )}
    </div>
  );
};

export default CollectionsPage;
