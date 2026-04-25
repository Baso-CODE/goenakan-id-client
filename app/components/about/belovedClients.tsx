"use client";

import { BrandClient } from "@/app/types/brandClient.type";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import Marquee from "react-fast-marquee";

interface BelovedClientsProps {
  heading?: string;
  storiesHref?: string;
  storiesLabel?: string;
  clients?: BrandClient[];
  speed?: number;
}

export function BelovedClients({
  heading = "The\nbeloved clients",
  storiesHref = "/portfolio",
  storiesLabel = "See their stories ↗",
  clients = [],
  speed = 40,
}: BelovedClientsProps) {
  if (!clients || clients.length === 0) {
    return null;
  }

  return (
    <section className="py-12 overflow-hidden">
      {/* Heading */}
      <div className="mx-auto mb-6 max-w-6xl px-4 md:px-8">
        <h2 className="text-4xl md:text-5xl font-light text-stone-900 leading-tight whitespace-pre-line">
          {heading}
        </h2>
        <Link
          href={storiesHref}
          className="inline-block mt-2 text-sm text-stone-400 hover:text-stone-700 transition-colors">
          {storiesLabel}
        </Link>
      </div>

      {/* Marquee — kanan ke kiri */}
      <Marquee speed={speed} gradient={false} pauseOnHover>
        {clients.map((client) => (
          <div key={client.id} className="mx-2">
            <ClientCard client={client} />
          </div>
        ))}
      </Marquee>
    </section>
  );
}

function ClientCard({ client }: { client: BrandClient }) {
  const imageContent = (
    <div
      className="relative bg-stone-100 border border-stone-200 rounded-sm overflow-hidden hover:shadow-sm transition-shadow grayscale hover:grayscale-0 duration-300"
      style={{ width: 140, height: 120 }}>
      <Image
        src={client.logo}
        alt={client.name}
        fill
        className="object-contain p-4"
        sizes="140px"
      />
    </div>
  );

  // Jika punya websiteUrl, buat agar bisa diklik
  if (client.websiteUrl) {
    return (
      <a href={client.websiteUrl} target="_blank" rel="noopener noreferrer">
        {imageContent}
      </a>
    );
  }

  return imageContent;
}
