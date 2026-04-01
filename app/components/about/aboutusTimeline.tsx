"use client";

import Image from "next/image";
import Link from "next/link";

interface TimelineItem {
  month: string;
  year: string;
  title: string;
  description: string;
}

interface AboutUsTimelineProps {
  backgroundImage?: string;
  tagline?: string;
  heading?: string;
  timeline?: TimelineItem[];
  profileHref?: string;
  profileButtonText?: string;
}

const DEFAULT_TIMELINE: TimelineItem[] = [
  {
    month: "Jun 20",
    year: "2021",
    title: "Lorem ipsum dolor sit amet, consectetur adipiscing",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  },
  {
    month: "Jun 20",
    year: "2022",
    title: "Lorem ipsum dolor sit amet, consectetur adipiscing",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  },
  {
    month: "Jun 20",
    year: "2024",
    title: "Lorem ipsum dolor sit amet, consectetur adipiscing",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  },
  {
    month: "Jun 20",
    year: "2026",
    title: "Lorem ipsum dolor sit amet, consectetur adipiscing",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  },
];

export function AboutUsTimeline({
  backgroundImage = "/images/about/bg-about-timeline.png",
  tagline = "About us",
  heading = "We're dedicated to turning\nideas into tangible products",
  timeline = DEFAULT_TIMELINE,
  profileHref = "/profile",
  profileButtonText = "Click to see our company profile",
}: AboutUsTimelineProps) {
  return (
    <section className="relative w-full overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={backgroundImage}
          alt="About us background"
          fill
          className="object-cover object-center"
          priority
        />

        <div className="absolute inset-0 bg-linear-to-b from-black/80 via-black/65 to-black/75" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-3xl mx-auto px-6 py-16 md:py-20">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-stone-400 text-xs tracking-widest uppercase mb-3">
            {tagline}
          </p>
          <h1 className="text-white font-serif text-3xl md:text-5xl leading-tight whitespace-pre-line">
            {heading}
          </h1>
        </div>

        {/* Timeline */}
        <div className="flex flex-col">
          {timeline.map((item, index) => (
            <div key={index}>
              {/* Divider */}
              <div className="h-px bg-white/20 w-full" />

              <div className="grid grid-cols-[100px_1fr] gap-6 py-7">
                {/* Date */}
                <div className="flex flex-col">
                  <span className="text-stone-400 text-xs">{item.month}</span>
                  <span className="text-white text-2xl font-light tracking-wide">
                    {item.year}
                  </span>
                </div>

                {/* Text */}
                <div className="flex flex-col gap-2">
                  <h3 className="text-white font-medium text-base leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-stone-100 text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {/* Last divider */}
          <div className="h-px bg-white/20 w-full" />
        </div>

        {/* CTA Button */}
        <div className="flex justify-center mt-10">
          <Link
            href={profileHref}
            className="border hover:border-[#c4a882] hover:text-[#c4a882] text-white border-white bg-[#c6a28d] hover:bg-transparent text-sm px-8 py-3 rounded-sm  transition-colors ">
            {profileButtonText}
          </Link>
        </div>
      </div>
    </section>
  );
}
