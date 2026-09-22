"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

const Portfolio = dynamic(() => import("../Portfolio"), {
  ssr: false,
  loading: () => <PortfolioSkeleton />,
});

function PortfolioSkeleton() {
  return (
    <section className="w-full bg-white pb-20">
      <div className="w-full h-100 md:h-125 mb-16 bg-stone-100 animate-pulse" />

      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index}>
              <div className="aspect-4/5 bg-stone-100 animate-pulse" />

              <div className="mt-4 space-y-2">
                <div className="h-5 bg-stone-100 animate-pulse rounded w-3/4 mx-auto" />
                <div className="h-4 bg-stone-100 animate-pulse rounded w-1/2 mx-auto" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function LazyPortfolio() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const element = containerRef.current;

    if (!element || shouldLoad) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: "500px 0px",
      },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [shouldLoad]);

  return (
    <div ref={containerRef}>
      {shouldLoad ? <Portfolio /> : <PortfolioSkeleton />}
    </div>
  );
}
