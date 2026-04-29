import { useState } from "react";
import { createInquiry } from "../../lib/api";

const initialForm = {
  name: "",
  phone: "",
  city: "",
  message: "",
};

const InquiryForm = ({
  title = "Request a callback",
  description = "Share your requirement and we will contact you shortly.",
  productName = "",
  submitLabel = "Send inquiry",
  source = "website",
  defaultMessage = "",
  className = "",
}) => {
  const [form, setForm] = useState({
    ...initialForm,
    message: defaultMessage,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: "", message: "" });

    try {
      await createInquiry({
        ...form,
        productName,
        source,
      });
      setStatus({
        type: "success",
        message: "Thanks. Your enquiry has been sent and we will reach out soon.",
      });
      setForm({
        ...initialForm,
        message: defaultMessage,
      });
    } catch (error) {
      setStatus({
        type: "error",
        message: error.message || "Unable to send inquiry right now.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className={`glass-panel rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden ${className}`}>
      {/* Decorative gradient blob */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-[var(--accent)] opacity-[0.08] rounded-full blur-3xl pointer-events-none"></div>
      
      <div className="grid md:grid-cols-2 gap-12 relative z-10">
        <div className="space-y-6 flex flex-col justify-center">
          <div className="w-12 h-1 bg-[var(--accent)] rounded-full"></div>
          <h2 className="text-4xl md:text-5xl font-serif text-white leading-tight">{title}</h2>
          <p className="text-lg leading-relaxed text-[var(--text-muted)] max-w-md">{description}</p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="col-span-2 md:col-span-1 w-full rounded-2xl border border-[var(--glass-border)] bg-black/40 backdrop-blur-md px-5 py-4 text-sm text-white outline-none transition focus:border-[var(--accent)] focus:bg-black/60 placeholder-white/40"
              placeholder="Your name"
              required
            />
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="col-span-2 md:col-span-1 w-full rounded-2xl border border-[var(--glass-border)] bg-black/40 backdrop-blur-md px-5 py-4 text-sm text-white outline-none transition focus:border-[var(--accent)] focus:bg-black/60 placeholder-white/40"
              placeholder="Phone or WhatsApp"
              required
            />
          </div>
          <input
            name="city"
            value={form.city}
            onChange={handleChange}
            className="w-full rounded-2xl border border-[var(--glass-border)] bg-black/40 backdrop-blur-md px-5 py-4 text-sm text-white outline-none transition focus:border-[var(--accent)] focus:bg-black/60 placeholder-white/40"
            placeholder="Your area / city"
          />
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            className="h-32 w-full resize-none rounded-2xl border border-[var(--glass-border)] bg-black/40 backdrop-blur-md px-5 py-4 text-sm text-white outline-none transition focus:border-[var(--accent)] focus:bg-black/60 placeholder-white/40"
            placeholder="Tell us what you want to buy"
            required
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-2xl bg-gradient-to-r from-[var(--accent)] to-amber-700 px-6 py-4 text-sm font-semibold text-white transition-all duration-300 hover:shadow-[0_0_20px_rgba(214,161,90,0.3)] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "Sending..." : submitLabel}
          </button>
        </form>
      </div>

      {status.message && (
        <div className="mt-6 p-4 rounded-2xl glass border border-[var(--glass-border)] relative z-10 flex items-center justify-center">
          <p
            className={`text-sm ${
              status.type === "success"
                ? "text-emerald-400"
                : "text-rose-400"
            }`}
          >
            {status.message}
          </p>
        </div>
      )}
    </section>
  );
};

export default InquiryForm;
