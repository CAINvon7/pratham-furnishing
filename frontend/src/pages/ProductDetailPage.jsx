import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ProductCard from "../components/product/ProductCard";
import ProductImage from "../components/product/ProductImage";
import InquiryForm from "../components/common/InquiryForm";
import { buildWhatsAppLink } from "../data/products";

const ProductDetailPage = ({ productMap, products, productsLoading }) => {
  const { id } = useParams();
  const product = productMap[id];
  const [activeImage, setActiveImage] = useState(0);

  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return products.filter((item) => item.category === product.category && item.id !== product.id).slice(0, 3);
  }, [product, products]);

  if (productsLoading) {
    return (
      <div className="grid gap-12 md:grid-cols-2 max-w-6xl mx-auto pt-8">
        <div className="animate-pulse space-y-4">
          <div className="h-[500px] rounded-3xl glass border-[var(--glass-border)] bg-white/5" />
          <div className="grid grid-cols-4 gap-3">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div key={`thumb-skeleton-${idx}`} className="h-24 rounded-xl glass bg-white/5" />
            ))}
          </div>
        </div>
        <div className="animate-pulse space-y-6">
          <div className="h-4 w-28 rounded bg-white/10" />
          <div className="h-12 w-3/4 rounded bg-white/10" />
          <div className="h-8 w-40 rounded bg-white/10" />
          <div className="h-24 w-full rounded bg-white/10" />
          <div className="h-32 rounded-3xl glass bg-white/5" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="space-y-6 text-center py-32 glass-panel rounded-3xl max-w-2xl mx-auto border-[var(--glass-border)]">
        <div className="w-20 h-20 mx-auto bg-white/5 rounded-full flex items-center justify-center">
           <span className="text-3xl opacity-50">📦</span>
        </div>
        <p className="text-2xl font-serif text-white">Product not found.</p>
        <Link to="/collections" className="inline-block text-[var(--accent)] hover:text-white transition-colors border-b border-[var(--accent)]">Back to collections</Link>
      </div>
    );
  }

  const whatsappLink = buildWhatsAppLink(
    `Hi, I'm interested in ${product.name}. Please share price, availability, and delivery details.`
  );

  return (
    <div className="space-y-20 max-w-6xl mx-auto pb-24">
      <section className="reveal grid gap-12 md:grid-cols-[1fr_0.95fr] pt-8">
        <div className="space-y-6">
          <div className="overflow-hidden rounded-3xl border border-[var(--glass-border)] glass aspect-[4/5] md:aspect-auto md:h-[600px] relative group">
            <ProductImage
              src={product.images[activeImage]}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--surface)] via-transparent to-transparent opacity-60"></div>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {product.images.map((image, index) => (
              <button
                key={`${index}-${image}`}
                type="button"
                onClick={() => setActiveImage(index)}
                className={`overflow-hidden rounded-xl border transition-all duration-300 aspect-square ${activeImage === index ? 'border-[var(--accent)] shadow-[0_0_15px_rgba(214,161,90,0.3)]' : 'border-[var(--glass-border)] glass opacity-60 hover:opacity-100'}`}
              >
                <ProductImage
                  src={image}
                  alt={`${product.name} ${index + 1}`}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        <article className="space-y-8 flex flex-col justify-center">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="glass px-4 py-1.5 rounded-full text-xs uppercase tracking-widest text-white/80 border-[var(--glass-border)]">{product.category}</span>
              {product.color && <span className="text-[var(--text-muted)] text-sm tracking-wide">{product.color}</span>}
            </div>
            <h1 className="text-4xl md:text-5xl font-serif text-white leading-tight">{product.name}</h1>
            <p className="text-2xl text-gradient font-medium">
              {product.contactForPrice ? "Contact for Price" : `INR ${product.price}`}
            </p>
          </div>
          
          <div className="prose prose-invert max-w-none">
            <p className="text-[var(--text-muted)] text-lg leading-relaxed">{product.description}</p>
          </div>

          <div className="glass-panel rounded-3xl p-6 md:p-8 space-y-4 border border-[var(--glass-border)]">
            <h3 className="font-serif text-xl text-white border-b border-[var(--glass-border)] pb-4 mb-4">Product Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 text-sm">
              <div className="space-y-1">
                <p className="text-[var(--text-muted)] uppercase tracking-wider text-xs">Material</p>
                <p className="text-white font-medium">{product.material}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[var(--text-muted)] uppercase tracking-wider text-xs">Size</p>
                <p className="text-white font-medium">{product.size}</p>
              </div>
              <div className="space-y-1 sm:col-span-2">
                <p className="text-[var(--text-muted)] uppercase tracking-wider text-xs">Care</p>
                <p className="text-white font-medium">{product.care}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-[var(--glass-border)]">
            {whatsappLink !== "#" && (
              <a href={whatsappLink} target="_blank" rel="noreferrer" className="flex-1 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-700 px-6 py-4 text-center text-sm font-semibold text-white shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] transition-all">
                Ask on WhatsApp
              </a>
            )}
            <Link to="/contact" className="flex-1 rounded-2xl glass border border-[var(--glass-border)] px-6 py-4 text-center text-sm font-semibold text-white hover:bg-white/5 transition-colors">
              Visit Store
            </Link>
          </div>
        </article>
      </section>

      <div className="max-w-4xl mx-auto">
        <InquiryForm
          title="Interested in this product?"
          description="Send a quick enquiry and we will contact you with pricing, stock, and local delivery details."
          productName={product.name}
          source="product-page"
          submitLabel="Request Quote"
          defaultMessage={`Hi, I want more details about ${product.name}.`}
          className="mt-12 border border-[var(--accent)]/20"
        />
      </div>

      {relatedProducts.length > 0 && (
        <section className="reveal space-y-8 pt-12 border-t border-[var(--glass-border)]">
          <h2 className="text-3xl font-serif text-white text-center">Related <span className="italic text-[var(--accent)] font-light">Products</span></h2>
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
            {relatedProducts.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetailPage;
