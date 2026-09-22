"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

const BestSeller = dynamic(() => import("../BestSeller"), {
  ssr: false,
  loading: () => <BestSellerLoading />,
});

function BestSellerLoading() {
  return (
    <section className="w-full py-20 bg-gray-50/50">
      <div className="container">
        <div className="h-10 w-64 mx-auto bg-gray-200 animate-pulse mb-12" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="bg-white border border-gray-200">
              <div className="aspect-square bg-gray-200 animate-pulse" />

              <div className="p-6">
                <div className="h-5 bg-gray-200 animate-pulse w-3/4 mb-3" />
                <div className="h-4 bg-gray-200 animate-pulse w-1/2 mb-2" />
                <div className="h-4 bg-gray-200 animate-pulse w-2/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function LazyBestSeller() {
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
        rootMargin: "700px 0px",
        threshold: 0,
      },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [shouldLoad]);

  return (
    <div
      ref={sectionRef}
      className={!shouldLoad ? "min-h-225 bg-gray-50/50" : undefined}>
      {shouldLoad ? <BestSeller /> : null}
    </div>
  );
}
