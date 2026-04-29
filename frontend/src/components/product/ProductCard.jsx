import { Link } from "react-router-dom";
import ProductImage from "./ProductImage";
import { buildWhatsAppLink } from "../../data/products";

const ProductCard = ({ product }) => {
  const meta = [product.fabricType, product.color].filter(Boolean).join(" | ");
  const whatsappHref = buildWhatsAppLink(`Hi, I'm interested in ${product.name}. Please share price and availability.`);

  return (
    <article className="group overflow-hidden rounded-[2rem] border border-[var(--glass-border)] glass-panel transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(214,161,90,0.15)] flex flex-col">
      <div className="relative aspect-[4/5] overflow-hidden bg-black/50">
        <ProductImage
          src={product.images?.[0]}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--surface)] via-transparent to-transparent opacity-80"></div>
        <div className="absolute top-4 left-4">
          <span className="glass px-3 py-1.5 rounded-full text-[10px] uppercase tracking-widest text-white border border-[var(--glass-border)] backdrop-blur-md">
            {product.category}
          </span>
        </div>
      </div>
      <div className="flex flex-col flex-1 p-6 z-10 relative bg-[var(--surface)]/40 backdrop-blur-sm -mt-12">
        <div className="flex-1 space-y-2">
          <h3 className="text-xl font-serif text-white group-hover:text-[var(--accent)] transition-colors">{product.name}</h3>
          {meta && <p className="text-xs tracking-wide text-[var(--text-muted)]">{meta}</p>}
        </div>
        <div className="mt-6 pt-4 border-t border-[var(--glass-border)] flex items-center justify-between">
          <p className="text-sm font-medium text-[var(--accent)]">
            {product.contactForPrice ? "Contact for Price" : `INR ${product.price}`}
          </p>
          <div className="flex items-center gap-3">
            {whatsappHref !== "#" && (
              <a href={whatsappHref} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full glass border-[var(--glass-border)] flex items-center justify-center text-emerald-400 hover:bg-emerald-400 hover:text-black transition-all" title="Ask on WhatsApp">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
              </a>
            )}
            <Link to={`/product/${product.id}`} className="w-8 h-8 rounded-full glass border-[var(--glass-border)] flex items-center justify-center text-white hover:bg-[var(--accent)] hover:border-[var(--accent)] transition-all">
              <span className="sr-only">View Details</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
