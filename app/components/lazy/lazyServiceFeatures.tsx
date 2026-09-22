"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

const ServiceFeatures = dynamic(() => import("../ServiceFeatures"), {
  ssr: false,
  loading: () => <ServiceFeaturesLoading />,
});

function ServiceFeaturesLoading() {
  return (
    <section className="w-full py-32 bg-[#1E1E1E] border-b border-gray-100">
      <div className="container">
        <div className="text-center mb-16">
          <div className="h-10 md:h-12 w-2/3 max-w-xl mx-auto bg-white/10 rounded animate-pulse mb-6" />

          <div className="h-4 w-3/4 max-w-2xl mx-auto bg-white/10 rounded animate-pulse" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-6 gap-y-14 gap-x-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="flex flex-col items-center gap-5">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-white/10 rounded animate-pulse" />

              <div className="h-4 w-24 bg-white/10 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function LazyServiceFeatures() {
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
    <div
      ref={sectionRef}
      className={!shouldLoad ? "min-h-125 bg-[#1E1E1E]" : undefined}>
      {shouldLoad ? <ServiceFeatures /> : null}
    </div>
  );
}
