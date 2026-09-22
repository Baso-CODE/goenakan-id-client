"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

const ProductCategory = dynamic(() => import("../ProductCategory"), {
  ssr: false,
  loading: () => <ProductCategoryLoading />,
});

function ProductCategoryLoading() {
  return (
    <section className="w-full py-20 bg-white">
      <div className="container">
        <div className="h-10 w-64 mx-auto bg-stone-100 animate-pulse mb-16" />

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="w-full aspect-square bg-stone-100 animate-pulse rounded-sm"
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default function LazyProductCategory() {
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
      className={!shouldLoad ? "min-h-162.5 bg-white" : undefined}>
      {shouldLoad ? <ProductCategory /> : null}
    </div>
  );
}
