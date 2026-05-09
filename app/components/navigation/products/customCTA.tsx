"use client";

import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";

interface CustomCTAProps {
  title?: string;
  description?: string;
  buttonText?: string;
  onButtonClick?: () => void;
  href?: string;
}

export function CustomCTA({
  title = "Can't Find the Product\nYou're Looking For?",
  description = "No worries. Create it yourself with our custom mockup generator.\nFrom ideas to visuals, we'll help bring it to life.",
  buttonText = "Start Customizing",
  onButtonClick,
  href = "/customize",
}: CustomCTAProps) {
  return (
    <section className="w-full bg-[#463b34] py-16 px-6">
      <div className="max-w-2xl mx-auto flex flex-col items-center text-center gap-5">
        {/* Title */}
        <h2 className="text-white font-bold text-2xl md:text-3xl leading-snug whitespace-pre-line">
          {title}
        </h2>

        {/* Description */}
        <p className="text-stone-300 text-sm md:text-base leading-relaxed whitespace-pre-line">
          {description}
        </p>

        {/* Button */}
        {href ? (
          <Link href={href}>
            <Button
              variant="outline"
              className="mt-1 bg-transparent border border-white text-white text-sm px-8 py-2 h-10 rounded-sm hover:bg-white hover:text-[#3d342b] transition-colors duration-200">
              {buttonText}
            </Button>
          </Link>
        ) : (
          <Button
            variant="outline"
            onClick={onButtonClick}
            className="mt-1 bg-transparent border border-white text-white text-sm px-8 py-2 h-10 rounded-sm hover:bg-white hover:text-[#3d342b] transition-colors duration-200">
            {buttonText}
          </Button>
        )}
      </div>
    </section>
  );
}
