"use client";
import { useState, FormEvent, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

// Local Imports
import { useMovies } from "@/hooks/useMovies";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  MovieCard,
  LoadingState,
  MessageDisplay,
} from "@/components/MovieComponents";
import { Pagination } from "@/components/Pagination";
import { FilterControls } from "@/components/FilterControls";

// Main Page Component
function MovieSearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 1. Get ALL state from URL, including new filters
  const currentQuery = searchParams.get("query") || "";
  const currentPage = parseInt(searchParams.get("page") || "1");
  const currentGenre = searchParams.get("genre") || "";
  const currentYear = searchParams.get("year") || "";

  // Local state for the controlled input field
  const [searchInput, setSearchInput] = useState(currentQuery);

  // 2. Call useMovies with a SINGLE object argument
  const { movies, totalPages, isLoading, error } = useMovies({
    query: currentQuery,
    page: currentPage,
    genre: currentGenre,
    year: currentYear,
  });

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    params.set("query", searchInput);
    params.set("page", "1");
    router.push(`/?${params.toString()}`);
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage.toString());
    router.push(`/?${params.toString()}`);
  };

  return (
    <main className="container mx-auto p-4">

      <section className="text-center mb-12 mt-6">
        <h1 className="text-4xl md:text-5xl font-bold">
          Discover Your Next Favorite Film
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
          Explore thousands of movies, search for any title, and get all the
          details you need.
        </p>
      </section>

      <form onSubmit={handleSearch} className="flex max-w-xl mx-auto mb-4">
        <Input
          type="text"
          placeholder="Search for a movie..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="rounded-r-none"
        />
        <Button type="submit" className="rounded-l-none" disabled={isLoading}>
          {isLoading ? "Searching..." : "Search"}
        </Button>
      </form>

      {/* 3. Add the FilterControls component to the page */}
      <FilterControls />

      {/* --- Conditional Rendering Logic --- */}
      {isLoading && <LoadingState />}

      {error && !isLoading && <MessageDisplay message={error} />}

      {!isLoading && !error && movies.length > 0 && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
      
      {!isLoading && !error && movies.length === 0 && (
         <MessageDisplay message="No movies found" subMessage="Try adjusting your search or filters." />
      )}
    </main>
  );
}

// Suspense Wrapper Component
export default function Home() {
  return (
    <Suspense fallback={<LoadingState />}>
      <MovieSearchPage />
    </Suspense>
  );
}
