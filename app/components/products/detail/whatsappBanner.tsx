interface WhatsAppBannerProps {
  whatsappNumber: string;
  productName: string;
  locale?: string;
}

export function WhatsAppBanner({
  whatsappNumber,
  productName,
  locale = "id",
}: WhatsAppBannerProps) {
  const isEn = locale === "en";

  // 1. Pesan WhatsApp dinamis
  const rawMessage = isEn
    ? `Hello MinGoena, I would like to ask for a special quotation for the product: ${productName}`
    : `Halo MinGoena, saya ingin menanyakan harga khusus untuk produk: ${productName}`;

  // 2. Deskripsi Banner dinamis
  const bannerDescription = isEn
    ? "Looking for a quotation tailored to your needs? Contact us via WhatsApp and our team will be happy to assist you."
    : "Mencari penawaran harga yang disesuaikan dengan kebutuhan Anda? Hubungi kami via WhatsApp dan tim kami akan dengan senang hati membantu Anda.";

  // 3. Teks Tombol dinamis
  const buttonText = isEn ? "Request via WhatsApp" : "Tanya via WhatsApp";

  const message = encodeURIComponent(rawMessage);
  const href = `https://wa.me/${whatsappNumber}?text=${message}`;

  return (
    <div className="flex items-center justify-between gap-4 bg-[#3d342b] rounded-sm px-5 py-4 flex-col sm:flex-row">
      <p className="text-white/90 text-sm leading-relaxed text-center sm:text-left">
        {bannerDescription}
      </p>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="shrink-0 bg-white text-[#3d342b] text-xs font-semibold px-4 py-2.5 rounded-sm hover:bg-stone-100 transition-colors whitespace-nowrap">
        {buttonText}
      </a>
    </div>
  );
}
