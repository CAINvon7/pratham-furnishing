import { useEffect, useState } from "react";

const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme === "dark") {
      document.documentElement.classList.add("dark");
      setIsDark(true);
    }
  }, []);

  const toggleTheme = () => {
    const nextMode = !isDark;
    setIsDark(nextMode);
    document.documentElement.classList.toggle("dark", nextMode);
    localStorage.setItem("theme", nextMode ? "dark" : "light");
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="rounded-full border border-[var(--border)] px-3 py-1.5 text-xs text-[var(--text)]"
      aria-label="Toggle dark mode"
    >
      {isDark ? "Light" : "Dark"}
    </button>
  );
};

export default ThemeToggle;
