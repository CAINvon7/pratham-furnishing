import { useMemo, useState } from "react";
import FilterBar from "../components/product/FilterBar";
import ProductCard from "../components/product/ProductCard";
import SearchBar from "../components/common/SearchBar";
import { products } from "../data/products";

const CollectionsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({ fabricType: "", color: "", priceRange: "" });

  const options = useMemo(() => {
    return {
      fabricTypes: [...new Set(products.map((item) => item.fabricType))],
      colors: [...new Set(products.map((item) => item.color))]
    };
  }, []);

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
  }, [filters, searchQuery]);

  return (
    <div className="space-y-8">
      <header className="reveal space-y-3">
        <h1 className="text-4xl font-semibold text-[var(--text)]">Collections</h1>
        <p className="text-[var(--muted)]">Explore curtains, bedsheets, sofa fabrics and upholstery materials.</p>
      </header>

      <SearchBar value={searchQuery} onChange={setSearchQuery} />
      <FilterBar filters={filters} setFilters={setFilters} options={options} />

      <section className="reveal grid gap-6 md:grid-cols-3">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </section>
      {filteredProducts.length === 0 && (
        <p className="rounded-xl border border-dashed border-[var(--border)] p-6 text-center text-[var(--muted)]">
          No products match these filters yet.
        </p>
      )}
    </div>
  );
};

export default CollectionsPage;
