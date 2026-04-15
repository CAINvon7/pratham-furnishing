import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  return (
    <article className="group overflow-hidden rounded-2xl border border-[var(--border)] bg-white/60 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative h-56 overflow-hidden">
        <img
          src={product.images[0]}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
        />
      </div>
      <div className="space-y-2 p-4">
        <p className="text-xs uppercase tracking-wider text-[var(--muted)]">{product.category}</p>
        <h3 className="text-lg font-semibold text-[var(--text)]">{product.name}</h3>
        <p className="text-sm text-[var(--muted)]">{product.fabricType} | {product.color}</p>
        <p className="text-sm font-medium text-[var(--accent)]">
          {product.contactForPrice ? "Contact for Price" : `INR ${product.price}`}
        </p>
        <Link to={`/product/${product.id}`} className="inline-block pt-2 text-sm font-semibold text-[var(--accent)]">
          View details
        </Link>
      </div>
    </article>
  );
};

export default ProductCard;
