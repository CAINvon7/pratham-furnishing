import InquiryForm from "../components/common/InquiryForm";
import { businessInfo, whatsappLink } from "../data/products";

const ContactPage = () => {
  return (
    <div className="reveal grid gap-8 md:grid-cols-2">
      <section className="space-y-5">
        <div className="rounded-[2rem] border border-[var(--border)] bg-white/76 p-6">
          <h1 className="text-3xl font-semibold text-[var(--text)]">Contact Us</h1>
          <p className="mt-3 text-[var(--muted)]">
            Reach out for curtain selection, bedsheet pricing, sofa fabric advice, or a local store visit.
          </p>
          <div className="mt-5 grid gap-3">
            <div className="rounded-2xl bg-[var(--surface)] p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">Service Area</p>
              <p className="mt-2 font-semibold text-[var(--text)]">{businessInfo.city}</p>
            </div>
            <div className="rounded-2xl bg-[var(--surface)] p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">Store Address</p>
              <p className="mt-2 font-semibold leading-7 text-[var(--text)]">{businessInfo.address}</p>
            </div>
          </div>
        </div>

        <InquiryForm
          title="Send your requirement"
          description="Share what you need and we will reply with product suggestions, pricing, and local order support."
          submitLabel="Send inquiry"
          source="contact-page"
          defaultMessage="Hi, I would like details about your furnishing products."
        />

        <div className="flex flex-wrap gap-3">
          <a
            href={businessInfo.mapUrl}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-[var(--border)] px-4 py-2 text-sm font-semibold text-[var(--text)]"
          >
            Open in Maps
          </a>
          {whatsappLink !== "#" ? (
            <a href={whatsappLink} target="_blank" rel="noreferrer" className="rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-white">WhatsApp Chat</a>
          ) : null}
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-[var(--border)]">
        <iframe
          title="Pratham Furnishing location"
          src={businessInfo.mapEmbedUrl}
          className="h-full min-h-96 w-full"
          loading="lazy"
        />
      </section>
    </div>
  );
};

export default ContactPage;
