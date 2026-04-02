interface LocationMapProps {
  title?: string;
  address?: string;
  mapsUrl?: string;
  embedSrc?: string;
  height?: string;
}

export function LocationMap({
  title = "Our Location",
  address = "Jl. Modern Tengah IV, Gn. Anyar Tambak, Kec. Gn. Anyar, Surabaya, Jawa Timur 60294",
  mapsUrl = "https://maps.app.goo.gl/C4LixV4puCEEGfGg8",
  embedSrc = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3957.141910813212!2d112.80637229999999!3d-7.337955699999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd7fb00735fc047%3A0x130fd0de93b1e33b!2sGoenakan%20Indonesia!5e0!3m2!1sid!2sid!4v1775098763291!5m2!1sid!2sid",
  height = "340px",
}: LocationMapProps) {
  return (
    <section className="w-full bg-white border-t border-stone-100">
      {/* Header bar */}
      <div className="flex items-start justify-between px-6 py-4">
        <h2 className="text-2xl font-semibold text-stone-800">{title}</h2>
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm md:text-base text-stone-500 hover:text-stone-800 transition-colors text-right leading-relaxed max-w-xs">
          {address}
        </a>
      </div>

      {/* Map */}
      <div className="w-full overflow-hidden" style={{ height }}>
        <iframe
          src={embedSrc}
          width="100%"
          height="100%"
          style={{ border: 0, display: "block" }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Goenakan Indonesia Location"
        />
      </div>
    </section>
  );
}
