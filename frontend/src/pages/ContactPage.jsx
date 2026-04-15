import { whatsappLink } from "../data/products";

const ContactPage = () => {
  return (
    <div className="reveal grid gap-8 md:grid-cols-2">
      <section className="space-y-4 rounded-2xl border border-[var(--border)] bg-white/70 p-6">
        <h1 className="text-3xl font-semibold text-[var(--text)]">Contact Us</h1>
        <p className="text-[var(--muted)]">Visit our local store or place orders via WhatsApp.</p>

        <form className="space-y-3">
          <input className="w-full rounded-lg border border-[var(--border)] bg-white px-4 py-2" placeholder="Your name" />
          <input className="w-full rounded-lg border border-[var(--border)] bg-white px-4 py-2" placeholder="Phone number" />
          <textarea className="h-28 w-full rounded-lg border border-[var(--border)] bg-white px-4 py-2" placeholder="Tell us what fabric you need" />
          <button type="button" className="rounded-full bg-[var(--accent)] px-5 py-2 text-sm font-semibold text-white">Send Inquiry</button>
        </form>

        <div className="flex flex-wrap gap-3">
          <a href="tel:+919999999999" className="rounded-full border border-[var(--border)] px-4 py-2 text-sm font-semibold text-[var(--text)]">Click to Call</a>
          <a href={whatsappLink} target="_blank" rel="noreferrer" className="rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-white">WhatsApp Chat</a>
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-[var(--border)]">
        <iframe
          title="Pratham Furnishing location"
          src="https://www.google.com/maps?q=Ahmedabad&output=embed"
          className="h-full min-h-96 w-full"
          loading="lazy"
        />
      </section>
    </div>
  );
};

export default ContactPage;
