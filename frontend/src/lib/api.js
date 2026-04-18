const API_BASE = import.meta.env.VITE_API_URL;

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=1200&q=80";

function normalizeProduct(raw) {
  const images =
    Array.isArray(raw.images) && raw.images.length > 0
      ? raw.images
      : raw.image
        ? [raw.image]
        : [FALLBACK_IMAGE];

  return {
    id: raw._id ?? raw.id,
    name: raw.name ?? "",
    category: raw.category ?? "",
    price: typeof raw.price === "number" ? raw.price : Number(raw.price) || 0,
    description: raw.description ?? "",
    images,
    fabricType: raw.fabricType ?? "",
    color: raw.color ?? "",
    contactForPrice: Boolean(raw.contactForPrice),
    material: raw.material ?? "",
    size: raw.size ?? "",
    care: raw.care ?? "",
  };
}

export async function getProducts() {
  if (!API_BASE) {
    throw new Error("VITE_API_URL is missing. Add it to frontend/.env and restart npm run dev.");
  }

  const res = await fetch(`${API_BASE}/api/products`);
  if (!res.ok) throw new Error("Failed to fetch products");
  const contentType = res.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    throw new Error("API returned non-JSON response. Check VITE_API_URL and backend URL.");
  }

  const data = await res.json();
  return Array.isArray(data) ? data.map(normalizeProduct) : [];
}
