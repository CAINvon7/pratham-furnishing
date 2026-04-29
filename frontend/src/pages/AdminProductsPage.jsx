import { useEffect, useMemo, useState } from "react";
import {
  createProduct,
  deleteProduct,
  getAdminInquiries,
  getAdminSession,
  loginAdmin,
  logoutAdmin,
  setupAdmin,
  updateInquiryStatus,
  updateProduct,
} from "../lib/api";

const categoryOptions = ["Curtains", "Bedsheets", "Sofa Fabrics", "Upholstery", "Blinds", "Wallpaper"];
const inquiryStatusOptions = ["new", "contacted", "closed"];

const emptyForm = {
  name: "",
  category: "",
  price: "",
  description: "",
  fabricType: "",
  color: "",
  material: "",
  size: "",
  care: "",
  contactForPrice: false,
  imageInput: "",
};

const emptySetupForm = {
  setupKey: "",
  email: "",
  password: "",
};

const emptyLoginForm = {
  email: "",
  password: "",
};

function mapProductToForm(product) {
  return {
    name: product.name || "",
    category: product.category || "",
    price: product.contactForPrice ? "" : product.price || "",
    description: product.description || "",
    fabricType: product.fabricType || "",
    color: product.color || "",
    material: product.material || "",
    size: product.size || "",
    care: product.care || "",
    contactForPrice: Boolean(product.contactForPrice),
    imageInput: Array.isArray(product.images) ? product.images.join("\n") : "",
  };
}

function formatDate(dateValue) {
  if (!dateValue) return "Unknown";
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(dateValue));
}

function statusClasses(status) {
  if (status === "contacted") return "border-sky-200 bg-sky-50 text-sky-700";
  if (status === "closed") return "border-slate-200 bg-slate-100 text-slate-700";
  return "border-amber-200 bg-amber-50 text-amber-700";
}

const AdminProductsPage = ({ products, onProductsChange }) => {
  const [activeTab, setActiveTab] = useState("products");
  const [session, setSession] = useState({
    loading: true,
    authenticated: false,
    needsSetup: false,
    email: "",
  });
  const [setupForm, setSetupForm] = useState(emptySetupForm);
  const [loginForm, setLoginForm] = useState(emptyLoginForm);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState("");
  const [status, setStatus] = useState({ type: "", message: "" });
  const [authStatus, setAuthStatus] = useState({ type: "", message: "" });
  const [isSaving, setIsSaving] = useState(false);
  const [isDeletingId, setIsDeletingId] = useState("");
  const [isAuthSubmitting, setIsAuthSubmitting] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [inquiriesLoading, setInquiriesLoading] = useState(false);
  const [inquiriesError, setInquiriesError] = useState("");
  const [inquiryUpdatingId, setInquiryUpdatingId] = useState("");
  const [inquiryFilter, setInquiryFilter] = useState("all");
  const [inquirySearch, setInquirySearch] = useState("");

  const loadSession = async () => {
    try {
      const data = await getAdminSession();
      setSession({
        loading: false,
        authenticated: Boolean(data.authenticated),
        needsSetup: Boolean(data.needsSetup),
        email: data.email || "",
      });
    } catch (error) {
      setSession({
        loading: false,
        authenticated: false,
        needsSetup: false,
        email: "",
      });
      setAuthStatus({
        type: "error",
        message: error.message || "Unable to verify admin session.",
      });
    }
  };

  const loadInquiries = async () => {
    setInquiriesLoading(true);
    setInquiriesError("");

    try {
      const data = await getAdminInquiries();
      setInquiries(data);
    } catch (error) {
      setInquiriesError(error.message || "Could not load inquiries.");
    } finally {
      setInquiriesLoading(false);
    }
  };

  useEffect(() => {
    void loadSession();
  }, []);

  useEffect(() => {
    if (session.authenticated) {
      void loadInquiries();
    } else {
      setInquiries([]);
    }
  }, [session.authenticated]);

  const handleSetupChange = (event) => {
    const { name, value } = event.target;
    setSetupForm((current) => ({ ...current, [name]: value }));
  };

  const handleLoginChange = (event) => {
    const { name, value } = event.target;
    setLoginForm((current) => ({ ...current, [name]: value }));
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const resetForm = () => {
    setEditingId("");
    setForm(emptyForm);
    setUploadedImages([]);
  };

  const buildPayload = () => ({
    ...form,
    images: [
      ...uploadedImages,
      ...form.imageInput.split("\n").map((item) => item.trim()).filter(Boolean),
    ],
  });

  const imagePreviewList = useMemo(() => {
    return [
      ...uploadedImages,
      ...form.imageInput.split("\n").map((item) => item.trim()).filter(Boolean),
    ];
  }, [form.imageInput, uploadedImages]);

  const productStats = useMemo(() => {
    const contactForPriceCount = products.filter((item) => item.contactForPrice).length;
    const categoriesCount = new Set(products.map((item) => item.category).filter(Boolean)).size;
    return {
      total: products.length,
      contactForPrice: contactForPriceCount,
      categories: categoriesCount,
    };
  }, [products]);

  const filteredInquiries = useMemo(() => {
    return inquiries.filter((inquiry) => {
      const matchesFilter = inquiryFilter === "all" ? true : inquiry.status === inquiryFilter;
      const haystack = [inquiry.name, inquiry.phone, inquiry.city, inquiry.productName, inquiry.message]
        .join(" ")
        .toLowerCase();
      const matchesSearch = haystack.includes(inquirySearch.trim().toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [inquiries, inquiryFilter, inquirySearch]);

  const inquiryStats = useMemo(() => {
    return {
      total: inquiries.length,
      new: inquiries.filter((item) => item.status === "new").length,
      contacted: inquiries.filter((item) => item.status === "contacted").length,
    };
  }, [inquiries]);

  const handleSetupSubmit = async (event) => {
    event.preventDefault();
    setIsAuthSubmitting(true);
    setAuthStatus({ type: "", message: "" });

    try {
      const data = await setupAdmin(setupForm);
      setSession({
        loading: false,
        authenticated: Boolean(data.authenticated),
        needsSetup: false,
        email: data.email || "",
      });
      setSetupForm(emptySetupForm);
      setAuthStatus({ type: "success", message: "Admin account created and signed in." });
    } catch (error) {
      setAuthStatus({ type: "error", message: error.message || "Could not create admin account." });
    } finally {
      setIsAuthSubmitting(false);
    }
  };

  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    setIsAuthSubmitting(true);
    setAuthStatus({ type: "", message: "" });

    try {
      const data = await loginAdmin(loginForm);
      setSession({
        loading: false,
        authenticated: Boolean(data.authenticated),
        needsSetup: false,
        email: data.email || "",
      });
      setLoginForm(emptyLoginForm);
      setAuthStatus({ type: "success", message: "Logged in successfully." });
    } catch (error) {
      setAuthStatus({ type: "error", message: error.message || "Could not log in." });
    } finally {
      setIsAuthSubmitting(false);
    }
  };

  const handleLogout = async () => {
    setAuthStatus({ type: "", message: "" });

    try {
      await logoutAdmin();
      setSession((current) => ({
        ...current,
        authenticated: false,
        email: "",
      }));
      resetForm();
      setAuthStatus({ type: "success", message: "Logged out successfully." });
    } catch (error) {
      setAuthStatus({ type: "error", message: error.message || "Could not log out." });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    setStatus({ type: "", message: "" });

    try {
      if (editingId) {
        await updateProduct(editingId, buildPayload());
        setStatus({ type: "success", message: "Product updated successfully." });
      } else {
        await createProduct(buildPayload());
        setStatus({ type: "success", message: "Product added successfully." });
      }

      resetForm();
      await onProductsChange();
    } catch (error) {
      setStatus({ type: "error", message: error.message || "Could not save product." });
      if (error.message?.toLowerCase().includes("login")) {
        await loadSession();
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (product) => {
    setActiveTab("products");
    setEditingId(product.id);
    setForm(mapProductToForm(product));
    setUploadedImages([]);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleImageUpload = async (event) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    try {
      const nextImages = await Promise.all(
        files.map(
          (file) =>
            new Promise((resolve, reject) => {
              const reader = new FileReader();
              reader.onload = () => resolve(reader.result);
              reader.onerror = () => reject(new Error(`Failed to read ${file.name}`));
              reader.readAsDataURL(file);
            })
        )
      );

      setUploadedImages((current) => [...current, ...nextImages.filter(Boolean)]);
      setStatus({ type: "success", message: `${files.length} image${files.length > 1 ? "s" : ""} added to the product draft.` });
      event.target.value = "";
    } catch (error) {
      setStatus({ type: "error", message: error.message || "Could not upload images." });
    }
  };

  const removePreviewImage = (imageToRemove) => {
    if (uploadedImages.includes(imageToRemove)) {
      setUploadedImages((current) => current.filter((item) => item !== imageToRemove));
      return;
    }

    setForm((current) => ({
      ...current,
      imageInput: current.imageInput
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean)
        .filter((item) => item !== imageToRemove)
        .join("\n"),
    }));
  };

  const handleDelete = async (product) => {
    const confirmed = window.confirm(`Delete "${product.name}"?`);
    if (!confirmed) return;

    setIsDeletingId(product.id);
    setStatus({ type: "", message: "" });

    try {
      await deleteProduct(product.id);
      if (editingId === product.id) resetForm();
      setStatus({ type: "success", message: "Product deleted successfully." });
      await onProductsChange();
    } catch (error) {
      setStatus({ type: "error", message: error.message || "Could not delete product." });
      if (error.message?.toLowerCase().includes("login")) {
        await loadSession();
      }
    } finally {
      setIsDeletingId("");
    }
  };

  const handleInquiryStatusChange = async (inquiryId, nextStatus) => {
    setInquiryUpdatingId(inquiryId);
    setInquiriesError("");

    try {
      const updated = await updateInquiryStatus(inquiryId, nextStatus);
      setInquiries((current) => current.map((item) => (item.id === inquiryId ? updated : item)));
    } catch (error) {
      setInquiriesError(error.message || "Could not update inquiry.");
    } finally {
      setInquiryUpdatingId("");
    }
  };

  if (session.loading) {
    return (
      <div className="rounded-[2rem] border border-[var(--border)] bg-[var(--surface)] p-8 text-[var(--muted)]">
        Checking admin session...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header className="space-y-3">
        <h1 className="text-4xl font-semibold text-[var(--text)]">Store Dashboard</h1>
        <p className="max-w-3xl text-[var(--muted)]">
          Manage your catalog and track customer enquiries from one place.
        </p>
      </header>

      {authStatus.message ? (
        <p className={`rounded-2xl border px-4 py-3 text-sm ${authStatus.type === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-rose-200 bg-rose-50 text-rose-700"}`}>
          {authStatus.message}
        </p>
      ) : null}

      {!session.authenticated ? (
        session.needsSetup ? (
          <section className="max-w-2xl space-y-4 rounded-[2rem] border border-[var(--border)] bg-[var(--panel-strong)] p-6 shadow-[0_18px_45px_rgba(71,50,24,0.08)]">
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold text-[var(--text)]">Create your admin account</h2>
              <p className="text-sm text-[var(--muted)]">
                This only appears once. Use the setup key from `backend/.env`, then create your admin email and password.
              </p>
            </div>
            <form onSubmit={handleSetupSubmit} className="space-y-3">
              <input name="setupKey" value={setupForm.setupKey} onChange={handleSetupChange} type="password" placeholder="Setup key" required className="w-full rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm outline-none focus:border-[var(--accent)]" />
              <input name="email" value={setupForm.email} onChange={handleSetupChange} type="email" placeholder="Admin email" required className="w-full rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm outline-none focus:border-[var(--accent)]" />
              <input name="password" value={setupForm.password} onChange={handleSetupChange} type="password" placeholder="Password (min 10 characters)" required className="w-full rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm outline-none focus:border-[var(--accent)]" />
              <button type="submit" disabled={isAuthSubmitting} className="rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70">
                {isAuthSubmitting ? "Creating..." : "Create admin"}
              </button>
            </form>
          </section>
        ) : (
          <section className="max-w-2xl space-y-4 rounded-[2rem] border border-[var(--border)] bg-[var(--panel-strong)] p-6 shadow-[0_18px_45px_rgba(71,50,24,0.08)]">
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold text-[var(--text)]">Admin login</h2>
              <p className="text-sm text-[var(--muted)]">
                Sign in to manage your store products securely.
              </p>
            </div>
            <form onSubmit={handleLoginSubmit} className="space-y-3">
              <input name="email" value={loginForm.email} onChange={handleLoginChange} type="email" placeholder="Admin email" required className="w-full rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm outline-none focus:border-[var(--accent)]" />
              <input name="password" value={loginForm.password} onChange={handleLoginChange} type="password" placeholder="Password" required className="w-full rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm outline-none focus:border-[var(--accent)]" />
              <button type="submit" disabled={isAuthSubmitting} className="rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70">
                {isAuthSubmitting ? "Signing in..." : "Log in"}
              </button>
            </form>
          </section>
        )
      ) : (
        <>
          <section className="grid gap-4 md:grid-cols-4">
            <article className="rounded-[1.75rem] border border-[var(--border)] bg-[var(--surface)] p-5">
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">Products</p>
              <p className="mt-3 text-3xl font-semibold text-[var(--text)]">{productStats.total}</p>
            </article>
            <article className="rounded-[1.75rem] border border-[var(--border)] bg-[var(--surface)] p-5">
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">Categories</p>
              <p className="mt-3 text-3xl font-semibold text-[var(--text)]">{productStats.categories}</p>
            </article>
            <article className="rounded-[1.75rem] border border-[var(--border)] bg-[var(--surface)] p-5">
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">New Enquiries</p>
              <p className="mt-3 text-3xl font-semibold text-[var(--text)]">{inquiryStats.new}</p>
            </article>
            <article className="rounded-[1.75rem] border border-[var(--border)] bg-[var(--surface)] p-5">
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">Signed In</p>
              <p className="mt-3 truncate text-lg font-semibold text-[var(--text)]">{session.email}</p>
            </article>
          </section>

          <section className="flex flex-wrap items-center justify-between gap-3 rounded-[2rem] border border-[var(--border)] bg-[var(--surface)] p-6">
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setActiveTab("products")}
                className={`rounded-full px-4 py-2 text-sm font-semibold ${activeTab === "products" ? "bg-[var(--accent)] text-white" : "border border-[var(--border)] text-[var(--text)]"}`}
              >
                Products
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("inquiries")}
                className={`rounded-full px-4 py-2 text-sm font-semibold ${activeTab === "inquiries" ? "bg-[var(--accent)] text-white" : "border border-[var(--border)] text-[var(--text)]"}`}
              >
                Enquiries
              </button>
            </div>
            <button type="button" onClick={handleLogout} className="rounded-full border border-[var(--border)] px-5 py-2 text-sm font-semibold text-[var(--text)]">
              Log out
            </button>
          </section>

          {activeTab === "products" ? (
            <section className="grid gap-8 xl:grid-cols-[0.95fr_1.05fr]">
              <form onSubmit={handleSubmit} className="space-y-5 rounded-[2rem] border border-[var(--border)] bg-[var(--panel-strong)] p-6 shadow-[0_18px_45px_rgba(71,50,24,0.08)]">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h2 className="text-2xl font-semibold text-[var(--text)]">
                      {editingId ? "Edit product" : "Add product"}
                    </h2>
                    <p className="mt-1 text-sm text-[var(--muted)]">
                      Upload photos from your computer or paste image links, then add key fabric details and customer-friendly descriptions.
                    </p>
                  </div>
                  {editingId ? (
                    <button type="button" onClick={resetForm} className="text-sm font-semibold text-[var(--accent)]">
                      Clear form
                    </button>
                  ) : null}
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  <input name="name" value={form.name} onChange={handleChange} placeholder="Product name" required className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm outline-none focus:border-[var(--accent)]" />
                  <input list="category-options" name="category" value={form.category} onChange={handleChange} placeholder="Category" required className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm outline-none focus:border-[var(--accent)]" />
                  <input name="fabricType" value={form.fabricType} onChange={handleChange} placeholder="Fabric type" className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm outline-none focus:border-[var(--accent)]" />
                  <input name="color" value={form.color} onChange={handleChange} placeholder="Color" className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm outline-none focus:border-[var(--accent)]" />
                  <input name="material" value={form.material} onChange={handleChange} placeholder="Material" className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm outline-none focus:border-[var(--accent)]" />
                  <input name="size" value={form.size} onChange={handleChange} placeholder="Size" className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm outline-none focus:border-[var(--accent)]" />
                  <input name="care" value={form.care} onChange={handleChange} placeholder="Care instructions" className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm outline-none focus:border-[var(--accent)] md:col-span-2" />
                </div>

                <datalist id="category-options">
                  {categoryOptions.map((option) => (
                    <option key={option} value={option} />
                  ))}
                </datalist>

                <label className="flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--text)]">
                  <input type="checkbox" name="contactForPrice" checked={form.contactForPrice} onChange={handleChange} />
                  Contact for price instead of showing an INR amount
                </label>

                {!form.contactForPrice ? (
                  <input name="price" type="number" min="0" value={form.price} onChange={handleChange} placeholder="Price in INR" required className="w-full rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm outline-none focus:border-[var(--accent)]" />
                ) : null}

                <textarea name="description" value={form.description} onChange={handleChange} placeholder="Product description" required className="h-28 w-full rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm outline-none focus:border-[var(--accent)]" />
                <label className="block rounded-2xl border border-dashed border-[var(--border)] bg-[var(--surface)] px-4 py-4 text-sm text-[var(--muted)]">
                  <span className="mb-3 block font-semibold text-[var(--text)]">Upload product images</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(event) => void handleImageUpload(event)}
                    className="block w-full text-sm text-[var(--muted)] file:mr-4 file:rounded-full file:border-0 file:bg-[var(--accent)] file:px-4 file:py-2 file:font-semibold file:text-white"
                  />
                </label>
                <textarea name="imageInput" value={form.imageInput} onChange={handleChange} placeholder="Image URLs, one per line" className="h-32 w-full rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm outline-none focus:border-[var(--accent)]" />

                {imagePreviewList.length > 0 ? (
                  <div className="space-y-3">
                    <p className="text-sm font-semibold text-[var(--text)]">Image preview</p>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {imagePreviewList.slice(0, 4).map((image) => (
                        <div key={image} className="space-y-2">
                          <img src={image} alt="Product preview" className="h-36 w-full rounded-2xl border border-[var(--border)] object-cover" />
                          <button
                            type="button"
                            onClick={() => removePreviewImage(image)}
                            className="text-sm font-semibold text-rose-600"
                          >
                            Remove image
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}

                <button type="submit" disabled={isSaving} className="rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70">
                  {isSaving ? "Saving..." : editingId ? "Update product" : "Add product"}
                </button>

                {status.message ? (
                  <p className={`rounded-2xl border px-4 py-3 text-sm ${status.type === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-rose-200 bg-rose-50 text-rose-700"}`}>
                    {status.message}
                  </p>
                ) : null}
              </form>

              <section className="space-y-4 rounded-[2rem] border border-[var(--border)] bg-[var(--surface)] p-6">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h2 className="text-2xl font-semibold text-[var(--text)]">Current products</h2>
                    <p className="mt-1 text-sm text-[var(--muted)]">Edit or remove listings from your live store.</p>
                  </div>
                  <span className="rounded-full bg-[var(--surface)] px-3 py-1 text-sm text-[var(--muted)]">
                    {products.length} items
                  </span>
                </div>

                <div className="space-y-3">
                  {products.map((product) => (
                    <article key={product.id} className="grid gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 md:grid-cols-[120px_1fr_auto] md:items-center">
                      <img
                        src={product.images?.[0]}
                        alt={product.name}
                        className="h-24 w-full rounded-2xl object-cover"
                      />
                      <div className="space-y-1">
                        <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">{product.category}</p>
                        <h3 className="text-lg font-semibold text-[var(--text)]">{product.name}</h3>
                        <p className="text-sm text-[var(--muted)]">
                          {product.contactForPrice ? "Contact for price" : `INR ${product.price}`}
                        </p>
                        <p className="text-sm text-[var(--muted)]">
                          {[product.color, product.fabricType, product.material].filter(Boolean).join(" | ") || "No extra attributes"}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-3 md:flex-col">
                        <button type="button" onClick={() => handleEdit(product)} className="rounded-full border border-[var(--border)] px-4 py-2 text-sm font-semibold text-[var(--text)]">
                          Edit
                        </button>
                        <button type="button" onClick={() => handleDelete(product)} disabled={isDeletingId === product.id} className="rounded-full bg-rose-600 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70">
                          {isDeletingId === product.id ? "Deleting..." : "Delete"}
                        </button>
                      </div>
                    </article>
                  ))}

                  {products.length === 0 ? (
                    <p className="rounded-2xl border border-dashed border-[var(--border)] p-6 text-center text-[var(--muted)]">
                      No products yet. Add your first product from the form.
                    </p>
                  ) : null}
                </div>
              </section>
            </section>
          ) : (
            <section className="space-y-6 rounded-[2rem] border border-[var(--border)] bg-[var(--panel-strong)] p-6 shadow-[0_18px_45px_rgba(71,50,24,0.08)]">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <h2 className="text-2xl font-semibold text-[var(--text)]">Customer enquiries</h2>
                  <p className="mt-1 text-sm text-[var(--muted)]">Review incoming requests and mark follow-up progress.</p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <input
                    value={inquirySearch}
                    onChange={(event) => setInquirySearch(event.target.value)}
                    placeholder="Search name, phone, city..."
                    className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm outline-none focus:border-[var(--accent)]"
                  />
                  <select
                    value={inquiryFilter}
                    onChange={(event) => setInquiryFilter(event.target.value)}
                    className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm outline-none focus:border-[var(--accent)]"
                  >
                    <option value="all">All statuses</option>
                    {inquiryStatusOptions.map((option) => (
                      <option key={option} value={option}>
                        {option.charAt(0).toUpperCase() + option.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <article className="rounded-2xl bg-[var(--surface)] p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">Total enquiries</p>
                  <p className="mt-2 text-2xl font-semibold text-[var(--text)]">{inquiryStats.total}</p>
                </article>
                <article className="rounded-2xl bg-[var(--surface)] p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">New</p>
                  <p className="mt-2 text-2xl font-semibold text-[var(--text)]">{inquiryStats.new}</p>
                </article>
                <article className="rounded-2xl bg-[var(--surface)] p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">Contacted</p>
                  <p className="mt-2 text-2xl font-semibold text-[var(--text)]">{inquiryStats.contacted}</p>
                </article>
              </div>

              {inquiriesError ? (
                <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                  {inquiriesError}
                </p>
              ) : null}

              <div className="space-y-4">
                {inquiriesLoading ? (
                  <p className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 text-sm text-[var(--muted)]">
                    Loading enquiries...
                  </p>
                ) : filteredInquiries.length > 0 ? (
                  filteredInquiries.map((inquiry) => (
                    <article key={inquiry.id} className="space-y-4 rounded-[1.75rem] border border-[var(--border)] bg-[var(--surface)] p-5">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="space-y-1">
                          <h3 className="text-xl font-semibold text-[var(--text)]">{inquiry.name}</h3>
                          <p className="text-sm text-[var(--muted)]">
                            {inquiry.phone} {inquiry.city ? `| ${inquiry.city}` : ""} {inquiry.productName ? `| ${inquiry.productName}` : ""}
                          </p>
                          <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
                            {inquiry.source || "website"} | {formatDate(inquiry.createdAt)}
                          </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-3">
                          <span className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] ${statusClasses(inquiry.status)}`}>
                            {inquiry.status}
                          </span>
                          <select
                            value={inquiry.status}
                            disabled={inquiryUpdatingId === inquiry.id}
                            onChange={(event) => void handleInquiryStatusChange(inquiry.id, event.target.value)}
                            className="rounded-full border border-[var(--border)] bg-white px-3 py-2 text-sm outline-none focus:border-[var(--accent)] disabled:opacity-60"
                          >
                            {inquiryStatusOptions.map((option) => (
                              <option key={option} value={option}>
                                {option.charAt(0).toUpperCase() + option.slice(1)}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="rounded-2xl bg-[var(--surface)] p-4 text-sm leading-6 text-[var(--text)]">
                        {inquiry.message}
                      </div>
                    </article>
                  ))
                ) : (
                  <p className="rounded-2xl border border-dashed border-[var(--border)] p-6 text-center text-[var(--muted)]">
                    No enquiries match this filter yet.
                  </p>
                )}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
};

export default AdminProductsPage;
