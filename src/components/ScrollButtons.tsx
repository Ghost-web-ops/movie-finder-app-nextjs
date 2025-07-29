// components/ScrollButtons.tsx
"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";


interface ScrollButtonsProps {
  scrollRef: React.RefObject<HTMLDivElement | null>;
}

export function ScrollButtons({ scrollRef }: ScrollButtonsProps) {
  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -300 : 300,
      behavior: "smooth",
    });
  };

  return (
    <div className="flex gap-2 mb-4 justify-end">
      <Button variant="outline" onClick={() => scroll("left")}>
        <ChevronLeft className="w-5 h-5" />
      </Button>
      <Button variant="outline" onClick={() => scroll("right")}>
        <ChevronRight className="w-5 h-5" />
      </Button>
    </div>
  );
}
