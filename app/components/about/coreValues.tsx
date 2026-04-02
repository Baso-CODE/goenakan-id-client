interface CoreValue {
  title: string;
  description: string;
}

interface CoreValuesProps {
  heading?: string;
  subheading?: string;
  values?: CoreValue[];
}

const DEFAULT_VALUES: CoreValue[] = [
  {
    title: "Thoughtful Customization",
    description:
      "Kami percaya setiap produk harus dibuat dengan alasan, bukan sekadar dibuat. Setiap custom product dirancang dengan mempertimbangkan fungsi, konteks, dan pesan yang ingin disampaikan oleh brand.",
  },
  {
    title: "Detail Matters",
    description:
      "Bagi kami, kualitas terasa dari hal-hal kecil. Mulai dari pemilihan material, hasil akhir, hingga cara produk diterima oleh penerimanya — semua detail memiliki peran penting.",
  },
  {
    title: "Reliable Execution",
    description:
      "Ide yang bagus harus diikuti dengan eksekusi yang bisa diandalkan. Kami berkomitmen pada proses kerja yang rapi, timeline yang jelas, dan hasil yang konsisten sesuai ekspektasi klien.",
  },
  {
    title: "Responsible Choices",
    description:
      "Kami berusaha membuat pilihan yang lebih bertanggung jawab. Dengan mengutamakan produk yang dapat digunakan kembali, material yang lebih ramah lingkungan, dan produksi yang berkesadaran.",
  },
  {
    title: "Collaborative Mindset",
    description:
      "Proses terbaik lahir dari kolaborasi. Kami bekerja sebagai partner, bukan sekadar vendor, dengan komunikasi yang terbuka dan fleksibel di setiap tahap pengerjaan.",
  },
];

export function CoreValues({
  heading = "Our core\nvalues",
  subheading = "Di balik setiap produk yang kami buat, ada prinsip yang kami pegang dalam setiap keputusan dan proses kerja.",
  values = DEFAULT_VALUES,
}: CoreValuesProps) {
  return (
    <section className="w-full border-t border-stone-200 py-16 px-6 md:px-12">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Left — Heading */}
          <div className="flex flex-col justify-start gap-4 md:pr-8">
            <h2 className="text-4xl md:text-5xl font-light text-stone-900 leading-tight whitespace-pre-line">
              {heading}
            </h2>
            <p className="text-[#464646] text-md leading-relaxed">
              {subheading}
            </p>
          </div>

          {/* Right — Values Grid */}
          <div className="md:col-span-2">
            {/* Row 1: 2 kolom */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-10">
              {values.slice(0, 4).map((value, index) => (
                <ValueCard key={index} value={value} />
              ))}
            </div>

            {/* Row 2: item ke-5 sendirian di kiri */}
            {values[4] && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 mt-10">
                <ValueCard value={values[4]} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom divider */}
      <div className="max-w-5xl mx-auto mt-16 border-t border-stone-200" />
    </section>
  );
}

function ValueCard({ value }: { value: CoreValue }) {
  return (
    <div className="flex flex-col gap-2 border-t border-stone-200 pt-5">
      <h3 className="text-stone-800 font-lg text-lg leading-snug">
        {value.title}
      </h3>
      <p className="text-[#464646] text-sm leading-relaxed">
        {value.description}
      </p>
    </div>
  );
}
