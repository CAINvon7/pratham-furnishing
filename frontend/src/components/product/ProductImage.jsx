import { useEffect, useState } from "react";

export const PRODUCT_IMAGE_FALLBACK =
  "https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=1200&q=80";

/**
 * Product hero/thumbnail image with automatic fallback if URL is broken.
 */
const ProductImage = ({ src, alt, className, loading }) => {
  const [current, setCurrent] = useState(src || PRODUCT_IMAGE_FALLBACK);

  useEffect(() => {
    setCurrent(src || PRODUCT_IMAGE_FALLBACK);
  }, [src]);

  return (
    <img
      src={current}
      alt={alt}
      loading={loading}
      className={className}
      onError={() => setCurrent(PRODUCT_IMAGE_FALLBACK)}
    />
  );
};

export default ProductImage;
