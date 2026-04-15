import { whatsappLink } from "../../data/products";

const WhatsAppFloat = () => {
  return (
    <a
      href={whatsappLink}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-5 right-5 z-50 rounded-full bg-emerald-500 px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:scale-105"
    >
      WhatsApp Order
    </a>
  );
};

export default WhatsAppFloat;
