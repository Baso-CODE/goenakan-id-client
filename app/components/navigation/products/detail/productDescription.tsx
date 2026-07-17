interface ProductDescriptionProps {
  description: string;
  weight: string;
  dimensions: string;
  accessories: string | string[]; // ✨ Dukung array atau string
}

export function ProductDescription({
  description,
  weight,
  dimensions,
  accessories,
}: ProductDescriptionProps) {
  // Gabungkan array menjadi string jika datanya berbentuk array
  const formattedAccessories = Array.isArray(accessories)
    ? accessories.join(", ")
    : accessories || "-";

  const specs = [
    { label: "Weight", value: weight },
    { label: "Dimensions", value: dimensions },
    { label: "Acc", value: formattedAccessories },
  ];

  return (
    <div className="flex flex-col gap-4">
      {/* Description */}
      <div>
        <p className="text-sm text-stone-700 leading-relaxed whitespace-pre-line">
          <span className="font-semibold text-stone-900 block mb-1">Description</span>
          {description || "Tidak ada deskripsi."}
        </p>
      </div>

      {/* Specs */}
      <div className="flex flex-col gap-2 pt-2 border-t border-stone-100">
        {specs.map((spec) => (
          <div key={spec.label} className="flex gap-2 text-sm">
            <span className="text-stone-500 w-24 shrink-0 font-medium">
              {spec.label}:
            </span>
            <span className="text-stone-700">{spec.value}</span>
          </div>
        ))}
      </div>

      {/* More info toggle */}
      <button className="text-xs text-stone-400 hover:text-stone-600 transition-colors text-left flex items-center gap-1">
        more information
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
    </div>
  );
}
