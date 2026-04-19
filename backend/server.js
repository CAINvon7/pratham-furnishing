import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const allowedOrigins = (process.env.FRONTEND_URLS || process.env.FRONTEND_URL || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

/** Any Vite port (5173, 5174, …) without updating Render each time */
function isLocalDevOrigin(origin) {
  try {
    const u = new URL(origin);
    const host = u.hostname.toLowerCase();
    if (host !== "localhost" && host !== "127.0.0.1") return false;
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

/** Production + preview deploys: slug.vercel.app and slug-*.vercel.app */
function isVercelProjectOrigin(origin, slug) {
  if (!slug) return false;
  try {
    const u = new URL(origin);
    if (u.protocol !== "https:") return false;
    const host = u.hostname.toLowerCase();
    const s = slug.toLowerCase().replace(/^\/+|\/+$/g, "");
    if (!s) return false;
    if (host === `${s}.vercel.app`) return true;
    if (host.startsWith(`${s}-`) && host.endsWith(".vercel.app")) return true;
    return false;
  } catch {
    return false;
  }
}

const vercelAppSlug = (process.env.VERCEL_APP_SLUG || "").trim();

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true); // server-to-server / curl
      if (allowedOrigins.length === 0) return callback(null, true); // allow all when not configured
      if (allowedOrigins.includes(origin)) return callback(null, true);
      if (isLocalDevOrigin(origin)) return callback(null, true);
      if (vercelAppSlug && isVercelProjectOrigin(origin, vercelAppSlug)) return callback(null, true);
      console.warn("CORS blocked:", origin, "| configured:", allowedOrigins.join(", ") || "(none)");
      return callback(new Error(`CORS blocked origin: ${origin}`));
    },
  })
);
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ ok: true, name: "Pratham Furnishing API", docs: "/api/products" });
});

// DB CONNECTION
if (!process.env.MONGO_URI) {
  console.error("MONGO_URI is missing — add it in Render → Environment");
}
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB connect error:", err.message));

// SCHEMA
const ProductSchema = new mongoose.Schema({
  name: String,
  price: Number,
  image: String,
  description: String,
  category: String,
});

const Product = mongoose.model("Product", ProductSchema);

// GET PRODUCTS
app.get("/api/products", async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      console.error("GET /api/products: DB not connected (readyState=%s)", mongoose.connection.readyState);
      return res.status(503).json({ error: "Database unavailable" });
    }
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    console.error("GET /api/products:", err.message);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// ADD PRODUCT
app.post("/api/products", async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.json(product);
  } catch {
    res.status(500).json({ error: "Failed to add product" });
  }
});

// DELETE PRODUCT
app.delete("/api/products/:id", async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

// UPDATE PRODUCT
app.put("/api/products/:id", async (req, res) => {
  const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

const port = Number(process.env.PORT) || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));