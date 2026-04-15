import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ProductCard from "../components/product/ProductCard";
import { products, whatsappLink } from "../data/products";

const ProductDetailPage = ({ productMap }) => {
  const { id } = useParams();
  const product = productMap[id];
  const [activeImage, setActiveImage] = useState(0);

  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return products.filter((item) => item.category === product.category && item.id !== product.id).slice(0, 3);
  }, [product]);

  if (!product) {
    return (
      <div className="space-y-4 text-center">
        <p className="text-xl font-semibold text-[var(--text)]">Product not found.</p>
        <Link to="/collections" className="text-[var(--accent)]">Back to collections</Link>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <section className="reveal grid gap-8 md:grid-cols-2">
        <div className="space-y-4">
          <div className="overflow-hidden rounded-2xl border border-[var(--border)]">
            <img
              src={product.images[activeImage]}
              alt={product.name}
              className="h-[430px] w-full object-cover transition duration-500 hover:scale-110"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            {product.images.map((image, index) => (
              <button
                key={image}
                type="button"
                onClick={() => setActiveImage(index)}
                className="overflow-hidden rounded-xl border border-[var(--border)]"
              >
                <img src={image} alt={`${product.name} ${index + 1}`} loading="lazy" className="h-24 w-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        <article className="space-y-4">
          <p className="text-sm uppercase tracking-wider text-[var(--muted)]">{product.category}</p>
          <h1 className="text-4xl font-semibold text-[var(--text)]">{product.name}</h1>
          <p className="text-lg text-[var(--accent)]">
            {product.contactForPrice ? "Contact for Price" : `INR ${product.price}`}
          </p>
          <p className="text-[var(--muted)]">{product.description}</p>

          <div className="space-y-2 rounded-2xl border border-[var(--border)] bg-white/60 p-5 text-sm text-[var(--muted)]">
            <p><span className="font-semibold text-[var(--text)]">Material:</span> {product.material}</p>
            <p><span className="font-semibold text-[var(--text)]">Size:</span> {product.size}</p>
            <p><span className="font-semibold text-[var(--text)]">Care:</span> {product.care}</p>
          </div>

          <a href={whatsappLink} target="_blank" rel="noreferrer" className="inline-block rounded-full bg-emerald-500 px-6 py-3 text-sm font-semibold text-white">
            Inquire on WhatsApp
          </a>
        </article>
      </section>

      <section className="reveal space-y-4">
        <h2 className="text-2xl font-semibold text-[var(--text)]">Related products</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {relatedProducts.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default ProductDetailPage;
