"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

const Articles = dynamic(() => import("../Articles"), {
  ssr: false,
  loading: () => <ArticlesLoading />,
});

function ArticlesLoading() {
  return (
    <section className="w-full bg-white pb-24">
      <div className="w-full h-100 md:h-125 bg-gray-100 animate-pulse mb-16" />

      <div className="container">
        <div className="h-10 w-52 bg-gray-100 animate-pulse mx-auto mb-16" />

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index}>
              <div className="aspect-square bg-gray-100 animate-pulse mb-6" />

              <div className="h-5 bg-gray-100 animate-pulse w-3/4 mb-3" />
              <div className="h-4 bg-gray-100 animate-pulse w-full mb-2" />
              <div className="h-4 bg-gray-100 animate-pulse w-2/3" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function LazyArticles() {
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
      className={!shouldLoad ? "min-h-225 bg-white" : undefined}>
      {shouldLoad ? <Articles /> : null}
    </div>
  );
}
