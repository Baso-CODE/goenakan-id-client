import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  brand?: string;
  className?: string;
}

export function PageHeader({ title, brand, className }: PageHeaderProps) {
  return (
    <header
      className={cn(
        "flex items-center justify-between px-8 py-5 bg-[#3a3228]",
        className,
      )}>
      <h1 className="text-white font-bold text-lg tracking-widest uppercase">
        {title}
      </h1>
      {brand && (
        <span className="text-white font-serif text-2xl tracking-wide">
          {brand}
        </span>
      )}
    </header>
  );
}
