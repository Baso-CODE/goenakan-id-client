"use client";

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface LoadMoreButtonProps {
  onClick: () => void;
  isLoading?: boolean;
  hasMore?: boolean;
}

export function LoadMoreButton({
  onClick,
  isLoading = false,
  hasMore = true,
}: LoadMoreButtonProps) {
  if (!hasMore) return null;

  return (
    <div className="flex justify-center mt-10">
      <Button
        variant="outline"
        onClick={onClick}
        disabled={isLoading}
        className="border border-stone-300 rounded-sm text-stone-600 text-sm px-10 py-2 h-10 hover:bg-stone-50 hover:text-stone-800 transition-colors">
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Loading...
          </>
        ) : (
          "load more products"
        )}
      </Button>
    </div>
  );
}
