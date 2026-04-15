const SearchBar = ({ value, onChange }) => {
  return (
    <input
      type="search"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder="Search curtains, bedsheets, upholstery..."
      className="w-full rounded-full border border-[var(--border)] bg-white/70 px-5 py-3 text-sm outline-none ring-[var(--accent)]/30 transition focus:ring"
    />
  );
};

export default SearchBar;
