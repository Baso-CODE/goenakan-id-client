interface WhatsAppBannerProps {
  whatsappNumber: string;
  productName: string;
}

export function WhatsAppBanner({
  whatsappNumber,
  productName,
}: WhatsAppBannerProps) {
  const message = encodeURIComponent(
    `Halo, saya ingin menanyakan harga khusus untuk produk: ${productName}`,
  );
  const href = `https://wa.me/${whatsappNumber}?text=${message}`;

  return (
    <div className="flex items-center justify-between gap-4 bg-[#3d342b] rounded-sm px-5 py-4">
      <p className="text-white/90 text-sm leading-relaxed">
        Looking for a quotation tailored to your needs? Contact us via WhatsApp
        and our team will be happy to assist you.
      </p>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="shrink-0 bg-white text-[#3d342b] text-xs font-semibold px-4 py-2.5 rounded-sm hover:bg-stone-100 transition-colors whitespace-nowrap">
        Request via WhatsApp
      </a>
    </div>
  );
}
