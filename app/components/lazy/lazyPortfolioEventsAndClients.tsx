"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

const PortfolioEventsAndClients = dynamic(
  () => import("../PortfolioEventsAndClients"),
  {
    ssr: false,
    loading: () => <LoadingPlaceholder />,
  },
);

function LoadingPlaceholder() {
  return (
    <section className="w-full py-20 bg-white border-t border-gray-100">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-32">
          <div className="lg:col-span-3">
            <div className="h-6 w-32 bg-gray-100 animate-pulse rounded-sm" />
          </div>

          <div className="lg:col-span-9">
            <div className="h-10 w-2/3 bg-gray-100 animate-pulse rounded-sm mb-8" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index}>
                  <div className="aspect-square bg-gray-100 animate-pulse rounded-sm mb-4" />
                  <div className="h-5 w-3/4 bg-gray-100 animate-pulse rounded-sm" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function LazyPortfolioEventsAndClients() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const element = sectionRef.current;

    if (!element || shouldLoad) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;

        setShouldLoad(true);
        observer.disconnect();
      },
      {
        rootMargin: "600px 0px",
        threshold: 0,
      },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [shouldLoad]);

  return (
    <div ref={sectionRef} className={!shouldLoad ? "min-h-175" : undefined}>
      {shouldLoad ? <PortfolioEventsAndClients /> : null}
    </div>
  );
}
