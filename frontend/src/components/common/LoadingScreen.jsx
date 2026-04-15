const LoadingScreen = () => (
  <div className="fixed inset-0 z-[70] flex items-center justify-center bg-[var(--bg)]">
    <div className="space-y-2 text-center">
      <p className="text-lg font-semibold text-[var(--text)]">Pratham Furnishing</p>
      <p className="text-sm text-[var(--muted)]">Preparing premium collections...</p>
    </div>
  </div>
);

export default LoadingScreen;
