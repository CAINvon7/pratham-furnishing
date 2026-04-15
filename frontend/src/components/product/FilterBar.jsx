const FilterBar = ({ filters, setFilters, options }) => {
  const update = (key, value) => setFilters((prev) => ({ ...prev, [key]: value }));

  return (
    <div className="grid gap-3 rounded-2xl border border-[var(--border)] bg-white/60 p-4 md:grid-cols-3">
      <select
        value={filters.fabricType}
        onChange={(e) => update("fabricType", e.target.value)}
        className="rounded-lg border border-[var(--border)] bg-white px-3 py-2"
      >
        <option value="">All Fabric Types</option>
        {options.fabricTypes.map((item) => (
          <option key={item} value={item}>{item}</option>
        ))}
      </select>

      <select
        value={filters.color}
        onChange={(e) => update("color", e.target.value)}
        className="rounded-lg border border-[var(--border)] bg-white px-3 py-2"
      >
        <option value="">All Colors</option>
        {options.colors.map((item) => (
          <option key={item} value={item}>{item}</option>
        ))}
      </select>

      <select
        value={filters.priceRange}
        onChange={(e) => update("priceRange", e.target.value)}
        className="rounded-lg border border-[var(--border)] bg-white px-3 py-2"
      >
        <option value="">Any Price</option>
        <option value="under-2000">Under INR 2000</option>
        <option value="2000-3000">INR 2000 - INR 3000</option>
        <option value="above-3000">Above INR 3000</option>
      </select>
    </div>
  );
};

export default FilterBar;
