import { PRODUCT_IMAGE_FALLBACK } from "../components/product/ProductImage.jsx";

const API_BASE = import.meta.env.VITE_API_URL;

function normalizeProduct(raw) {
  const images =
    Array.isArray(raw.images) && raw.images.length > 0
      ? raw.images
      : raw.image
        ? [raw.image]
        : [PRODUCT_IMAGE_FALLBACK];

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

function normalizeInquiry(raw) {
  return {
    id: raw._id ?? raw.id,
    name: raw.name ?? "",
    phone: raw.phone ?? "",
    city: raw.city ?? "",
    productName: raw.productName ?? "",
    message: raw.message ?? "",
    source: raw.source ?? "",
    status: raw.status ?? "new",
    createdAt: raw.createdAt ?? "",
    updatedAt: raw.updatedAt ?? "",
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

export async function createInquiry(payload) {
  if (!API_BASE) {
    throw new Error("VITE_API_URL is missing. Add it to frontend/.env and restart npm run dev.");
  }

  const res = await fetch(`${API_BASE}/api/inquiries`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data?.error || "Failed to send inquiry");
  }

  return data;
}

function normalizeProductPayload(payload) {
  return {
    name: payload.name?.trim() || "",
    category: payload.category?.trim() || "",
    description: payload.description?.trim() || "",
    fabricType: payload.fabricType?.trim() || "",
    color: payload.color?.trim() || "",
    material: payload.material?.trim() || "",
    size: payload.size?.trim() || "",
    care: payload.care?.trim() || "",
    contactForPrice: Boolean(payload.contactForPrice),
    price: payload.contactForPrice ? 0 : Number(payload.price) || 0,
    image: payload.images?.[0] || payload.image || "",
    images: Array.isArray(payload.images)
      ? payload.images.map((item) => item.trim()).filter(Boolean)
      : [],
  };
}

async function adminRequest(path, options = {}) {
  if (!API_BASE) {
    throw new Error("VITE_API_URL is missing. Add it to frontend/.env and restart npm run dev.");
  }

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
    credentials: "include",
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data?.error || "Admin request failed");
  }

  return data;
}

export async function getAdminSession() {
  return adminRequest("/api/admin/session", {
    method: "GET",
  });
}

export async function setupAdmin(payload) {
  return adminRequest("/api/admin/setup", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function loginAdmin(payload) {
  return adminRequest("/api/admin/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function logoutAdmin() {
  return adminRequest("/api/admin/logout", {
    method: "POST",
  });
}

export async function createProduct(payload) {
  const data = await adminRequest(
    "/api/products",
    {
      method: "POST",
      body: JSON.stringify(normalizeProductPayload(payload)),
    }
  );

  return normalizeProduct(data);
}

export async function updateProduct(id, payload) {
  const data = await adminRequest(
    `/api/products/${id}`,
    {
      method: "PUT",
      body: JSON.stringify(normalizeProductPayload(payload)),
    }
  );

  return normalizeProduct(data);
}

export async function deleteProduct(id) {
  return adminRequest(
    `/api/products/${id}`,
    {
      method: "DELETE",
    }
  );
}

export async function getAdminInquiries() {
  const data = await adminRequest("/api/admin/inquiries", {
    method: "GET",
  });

  return Array.isArray(data) ? data.map(normalizeInquiry) : [];
}

export async function updateInquiryStatus(id, status) {
  const data = await adminRequest(`/api/admin/inquiries/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });

  return normalizeInquiry(data);
}
