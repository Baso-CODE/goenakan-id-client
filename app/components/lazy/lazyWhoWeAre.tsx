"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

const WhoWeAre = dynamic(() => import("../WhoWeAre"), {
  ssr: false,
  loading: () => <WhoWeAreLoading />,
});

function WhoWeAreLoading() {
  return (
    <section className="w-full py-20 bg-white">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-16 items-center">
          <div className="md:col-span-5">
            <div className="aspect-5/7 w-full bg-stone-100 animate-pulse rounded-sm" />
          </div>

          <div className="md:col-span-7">
            <div className="h-4 w-32 bg-stone-100 animate-pulse mb-4" />
            <div className="h-10 w-3/4 bg-stone-100 animate-pulse mb-6" />

            <div className="space-y-3 mb-8">
              <div className="h-4 w-full bg-stone-100 animate-pulse" />
              <div className="h-4 w-full bg-stone-100 animate-pulse" />
              <div className="h-4 w-4/5 bg-stone-100 animate-pulse" />
            </div>

            <div className="grid grid-cols-3 gap-6 mb-8">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index}>
                  <div className="h-8 w-16 bg-stone-100 animate-pulse mb-2" />
                  <div className="h-3 w-20 bg-stone-100 animate-pulse" />
                </div>
              ))}
            </div>

            <div className="h-12 w-40 bg-stone-100 animate-pulse" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default function LazyWhoWeAre() {
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
        rootMargin: "500px 0px",
        threshold: 0,
      },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [shouldLoad]);

  return (
    <div
      ref={sectionRef}
      className={!shouldLoad ? "min-h-175 bg-white" : undefined}>
      {shouldLoad ? <WhoWeAre /> : null}
    </div>
  );
}
