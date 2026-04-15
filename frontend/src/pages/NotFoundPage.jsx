import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div className="space-y-3 py-20 text-center">
      <h1 className="text-4xl font-semibold text-[var(--text)]">Page not found</h1>
      <p className="text-[var(--muted)]">The page you requested does not exist.</p>
      <Link to="/" className="text-[var(--accent)]">Go back home</Link>
    </div>
  );
};

export default NotFoundPage;
