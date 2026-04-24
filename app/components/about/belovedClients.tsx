"use client";

import { Link } from "@/i18n/routing";
import Image from "next/image";
import Marquee from "react-fast-marquee";

interface Client {
  id: string;
  name: string;
  logo: string;
}

interface BelovedClientsProps {
  heading?: string;
  storiesHref?: string;
  storiesLabel?: string;
  clients?: Client[];
  speed?: number;
}

const DEFAULT_CLIENTS: Client[] = Array.from({ length: 7 }, (_, i) => ({
  id: `client-${i + 1}`,
  name: `Client ${i + 1}`,
  logo: "/images/clients/placeholder.png",
}));

export function BelovedClients({
  heading = "The\nbeloved clients",
  storiesHref = "/portfolio",
  storiesLabel = "See their stories ↗",
  clients = DEFAULT_CLIENTS,
  speed = 40,
}: BelovedClientsProps) {
  return (
    <section className=" py-12 overflow-hidden">
      {/* Heading */}
      <div className="mx-auto mb-6 max-w-6xl ">
        <h2 className="text-4xl md:text-5xl font-light text-stone-900 leading-tight whitespace-pre-line">
          {heading}
        </h2>
        <Link
          href={storiesHref}
          className="inline-block mt-2 text-sm text-stone-400 hover:text-stone-700 transition-colors">
          {storiesLabel}
        </Link>
      </div>

      {/* Marquee — kanan ke kiri (direction default "left") */}
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

function ClientCard({ client }: { client: Client }) {
  return (
    <div
      className="relative bg-stone-200 rounded-sm overflow-hidden"
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
}
