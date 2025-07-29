"use client";

import { MovieCard } from "./MovieComponents";
import type { Movie } from "@/hooks/useMovies";
import { useRef } from "react";
import { ScrollButtons } from "./ScrollButtons"; // استيراد الكومبوننت

interface SimilarMoviesProps {
  movies: Movie[];
  title?: string;
}

export function SimilarMovies({
  movies,
  title = "Similar Movies",
}: SimilarMoviesProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  if (!movies || movies.length === 0) return null;

  return (
   <div className="mt-10 pt-6 border-t border-border">
  <div className="flex items-center justify-between mb-4">
    <h2 className="text-2xl font-bold text-foreground/90">{title}</h2>
    <ScrollButtons scrollRef={scrollRef} />
  </div>
      <div
        ref={scrollRef}
        className="flex overflow-x-auto gap-4 pb-4 no-scrollbar"
      >
        {movies.map((movie) => (
          <div key={movie.id} className="flex-shrink-0 w-40">
            <MovieCard movie={movie} />
          </div>
        ))}
      </div>
    </div>
  );
}
