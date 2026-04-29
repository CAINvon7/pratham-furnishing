import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import crypto from "crypto";

dotenv.config();

const app = express();
const allowedOrigins = (process.env.FRONTEND_URLS || process.env.FRONTEND_URL || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);
const adminSetupKey = (process.env.ADMIN_SETUP_KEY || "").trim();
const adminSessionCookie = "pf_admin_session";
const adminSessionMs = 1000 * 60 * 60 * 24 * 7;

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
    credentials: true,
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
  images: [String],
  description: String,
  category: String,
  fabricType: String,
  color: String,
  material: String,
  size: String,
  care: String,
  contactForPrice: Boolean,
});

const Product = mongoose.model("Product", ProductSchema);

const InquirySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    city: { type: String, default: "", trim: true },
    productName: { type: String, default: "", trim: true },
    message: { type: String, required: true, trim: true },
    source: { type: String, default: "website", trim: true },
    status: { type: String, default: "new", trim: true },
  },
  { timestamps: true }
);

const Inquiry = mongoose.model("Inquiry", InquirySchema);

const AdminSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    passwordHash: { type: String, required: true },
    sessionHash: { type: String, default: "" },
    sessionExpiresAt: { type: Date, default: null },
    lastLoginAt: { type: Date, default: null },
  },
  { timestamps: true }
);

const Admin = mongoose.model("Admin", AdminSchema);

function hashSecret(secret, salt = crypto.randomBytes(16).toString("hex")) {
  const derived = crypto.scryptSync(secret, salt, 64).toString("hex");
  return `${salt}:${derived}`;
}

function verifySecret(secret, storedHash = "") {
  const [salt, hash] = storedHash.split(":");
  if (!salt || !hash) return false;
  const derived = crypto.scryptSync(secret, salt, 64);
  const original = Buffer.from(hash, "hex");
  if (derived.length !== original.length) return false;
  return crypto.timingSafeEqual(derived, original);
}

function getCookieValue(req, name) {
  const cookieHeader = req.headers.cookie || "";
  const cookies = cookieHeader.split(";").map((part) => part.trim());
  const cookie = cookies.find((part) => part.startsWith(`${name}=`));
  if (!cookie) return "";
  return decodeURIComponent(cookie.slice(name.length + 1));
}

function setAdminSessionCookie(res, token) {
  const isProduction = process.env.NODE_ENV === "production";
  res.cookie(adminSessionCookie, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: isProduction,
    maxAge: adminSessionMs,
    path: "/",
  });
}

function clearAdminSessionCookie(res) {
  res.clearCookie(adminSessionCookie, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });
}

async function requireAdmin(req, res, next) {
  const sessionToken = getCookieValue(req, adminSessionCookie);
  if (!sessionToken) {
    return res.status(401).json({ error: "Admin login required" });
  }

  const admin = await Admin.findOne();
  if (!admin || !admin.sessionHash || !admin.sessionExpiresAt) {
    return res.status(401).json({ error: "Admin login required" });
  }

  if (admin.sessionExpiresAt.getTime() < Date.now()) {
    admin.sessionHash = "";
    admin.sessionExpiresAt = null;
    await admin.save();
    clearAdminSessionCookie(res);
    return res.status(401).json({ error: "Admin session expired" });
  }

  if (!verifySecret(sessionToken, admin.sessionHash)) {
    return res.status(401).json({ error: "Invalid admin session" });
  }

  req.admin = admin;
  return next();
}

app.get("/api/admin/session", async (req, res) => {
  try {
    const admin = await Admin.findOne();
    if (!admin) {
      return res.json({ authenticated: false, needsSetup: true });
    }

    const sessionToken = getCookieValue(req, adminSessionCookie);
    if (!sessionToken || !admin.sessionHash || !admin.sessionExpiresAt) {
      return res.json({ authenticated: false, needsSetup: false });
    }

    if (admin.sessionExpiresAt.getTime() < Date.now()) {
      admin.sessionHash = "";
      admin.sessionExpiresAt = null;
      await admin.save();
      clearAdminSessionCookie(res);
      return res.json({ authenticated: false, needsSetup: false });
    }

    if (!verifySecret(sessionToken, admin.sessionHash)) {
      return res.json({ authenticated: false, needsSetup: false });
    }

    return res.json({
      authenticated: true,
      needsSetup: false,
      email: admin.email,
    });
  } catch (err) {
    return res.status(500).json({ error: "Failed to verify admin session" });
  }
});

app.post("/api/admin/setup", async (req, res) => {
  try {
    const existingAdmin = await Admin.findOne();
    if (existingAdmin) {
      return res.status(409).json({ error: "Admin account is already configured" });
    }

    if (!adminSetupKey) {
      return res.status(503).json({ error: "ADMIN_SETUP_KEY is not configured on the server" });
    }

    const setupKey = req.body?.setupKey?.trim();
    const email = req.body?.email?.trim()?.toLowerCase();
    const password = req.body?.password || "";

    if (!setupKey || setupKey !== adminSetupKey) {
      return res.status(401).json({ error: "Invalid setup key" });
    }

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    if (password.length < 10) {
      return res.status(400).json({ error: "Password must be at least 10 characters long" });
    }

    const admin = await Admin.create({
      email,
      passwordHash: hashSecret(password),
    });

    const sessionToken = crypto.randomBytes(32).toString("hex");
    admin.sessionHash = hashSecret(sessionToken);
    admin.sessionExpiresAt = new Date(Date.now() + adminSessionMs);
    admin.lastLoginAt = new Date();
    await admin.save();

    setAdminSessionCookie(res, sessionToken);
    return res.status(201).json({
      authenticated: true,
      needsSetup: false,
      email: admin.email,
    });
  } catch (err) {
    console.error("POST /api/admin/setup:", err.message);
    return res.status(500).json({ error: "Failed to set up admin account" });
  }
});

app.post("/api/admin/login", async (req, res) => {
  try {
    const admin = await Admin.findOne();
    if (!admin) {
      return res.status(404).json({ error: "Admin account is not set up yet" });
    }

    const email = req.body?.email?.trim()?.toLowerCase();
    const password = req.body?.password || "";

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    if (email !== admin.email || !verifySecret(password, admin.passwordHash)) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const sessionToken = crypto.randomBytes(32).toString("hex");
    admin.sessionHash = hashSecret(sessionToken);
    admin.sessionExpiresAt = new Date(Date.now() + adminSessionMs);
    admin.lastLoginAt = new Date();
    await admin.save();

    setAdminSessionCookie(res, sessionToken);
    return res.json({
      authenticated: true,
      needsSetup: false,
      email: admin.email,
    });
  } catch (err) {
    console.error("POST /api/admin/login:", err.message);
    return res.status(500).json({ error: "Failed to log in" });
  }
});

app.post("/api/admin/logout", async (req, res) => {
  try {
    const admin = await Admin.findOne();
    if (admin) {
      admin.sessionHash = "";
      admin.sessionExpiresAt = null;
      await admin.save();
    }

    clearAdminSessionCookie(res);
    return res.json({ ok: true });
  } catch (err) {
    return res.status(500).json({ error: "Failed to log out" });
  }
});

app.get("/api/admin/inquiries", requireAdmin, async (req, res) => {
  try {
    const inquiries = await Inquiry.find().sort({ createdAt: -1 });
    return res.json(inquiries);
  } catch (err) {
    console.error("GET /api/admin/inquiries:", err.message);
    return res.status(500).json({ error: "Failed to fetch inquiries" });
  }
});

app.patch("/api/admin/inquiries/:id", requireAdmin, async (req, res) => {
  try {
    const nextStatus = req.body?.status?.trim();
    const allowedStatuses = ["new", "contacted", "closed"];

    if (!allowedStatuses.includes(nextStatus)) {
      return res.status(400).json({ error: "Invalid inquiry status" });
    }

    const inquiry = await Inquiry.findByIdAndUpdate(
      req.params.id,
      { status: nextStatus },
      { new: true }
    );

    if (!inquiry) {
      return res.status(404).json({ error: "Inquiry not found" });
    }

    return res.json(inquiry);
  } catch (err) {
    console.error("PATCH /api/admin/inquiries/:id:", err.message);
    return res.status(500).json({ error: "Failed to update inquiry" });
  }
});

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
app.post("/api/products", requireAdmin, async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.json(product);
  } catch {
    res.status(500).json({ error: "Failed to add product" });
  }
});

// DELETE PRODUCT
app.delete("/api/products/:id", requireAdmin, async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

// UPDATE PRODUCT
app.put("/api/products/:id", requireAdmin, async (req, res) => {
  const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

app.post("/api/inquiries", async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: "Database unavailable" });
    }

    const payload = {
      name: req.body?.name?.trim(),
      phone: req.body?.phone?.trim(),
      city: req.body?.city?.trim(),
      productName: req.body?.productName?.trim(),
      message: req.body?.message?.trim(),
      source: req.body?.source?.trim() || "website",
    };

    if (!payload.name || !payload.phone || !payload.message) {
      return res.status(400).json({ error: "Name, phone, and message are required" });
    }

    const inquiry = await Inquiry.create(payload);
    return res.status(201).json({
      ok: true,
      message: "Inquiry received",
      inquiryId: inquiry._id,
    });
  } catch (err) {
    console.error("POST /api/inquiries:", err.message);
    return res.status(500).json({ error: "Failed to save inquiry" });
  }
});

const port = Number(process.env.PORT) || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));
