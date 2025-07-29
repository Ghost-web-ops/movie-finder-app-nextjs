"use client";
import { useState, useEffect, FormEvent, Suspense } from "react";
import axios from "axios";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
}

// مكون لعرض رسالة التحميل
function MovieGridSkeleton() {
  return <div className="text-center col-span-full">Loading movies...</div>;
}

function MovieSearchPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPage = parseInt(searchParams.get("page") || "1");
  const currentSearch = searchParams.get("query") || "";

  // --- State جديد لحقل إدخال الصفحة ---
  const [pageInput, setPageInput] = useState(currentPage.toString());

  const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;

  useEffect(() => {
    const fetchMovies = async () => {
      setIsLoading(true);
      let url;
      if (currentSearch) {
        url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(
          currentSearch
        )}&language=en-US&page=${currentPage}`;
      } else {
        url = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-US&page=${currentPage}`;
      }
      try {
        const response = await axios.get(url);
        setMovies(response.data.results);
      } catch (error) {
        console.error("Failed to fetch movies:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMovies();
    setPageInput(currentPage.toString()); // تحديث حقل الإدخال عند تغير الصفحة
  }, [apiKey, currentPage, currentSearch]);

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    router.push(`/?query=${encodeURIComponent(searchQuery)}&page=1`);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1) return;
    const queryParam = currentSearch
      ? `query=${encodeURIComponent(currentSearch)}&`
      : "";
    router.push(`/?${queryParam}page=${newPage}`);
  };

  // دالة للانتقال للصفحة من حقل الإدخال
  const handleGoToPage = (e: FormEvent) => {
    e.preventDefault();
    const pageNum = parseInt(pageInput);
    if (!isNaN(pageNum) && pageNum > 0) {
      handlePageChange(pageNum);
    }
  };

  return (
    <main className="container mx-auto p-4">
      <section className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold">
          Discover Your Next Favorite Film
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Explore thousands of movies, search for any title, and get all the
          details you need. Your ultimate guide to the world of cinema starts
          here.
        </p>
      </section>

      <form onSubmit={handleSearch} className="flex max-w-xl mx-auto mb-4">
        <Input
          type="text"
          placeholder="Search for a movie..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="rounded-r-none"
        />
        <Button type="submit" className="rounded-l-none">
          Search
        </Button>
      </form>

      {isLoading ? (
        <MovieGridSkeleton />
      ) : movies.length > 0 ? ( // <--  الشرط الجديد: هل هناك أفلام؟
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {movies.map(
            (movie) =>
              movie.poster_path && (
                <Link
                  href={`/movies/${movie.id}`}
                  key={movie.id}
                  className="group"
                >
                  <div className="overflow-hidden rounded-lg">
                    <Image
                      src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                      alt={movie.title}
                      width={500}
                      height={750}
                      className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <h3 className="mt-2 text-sm font-semibold text-foreground truncate">
                    {movie.title}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {movie.release_date?.substring(0, 4)}
                  </p>
                </Link>
              )
          )}
        </div>
      ) : (
        // <--  ماذا سيحدث إذا لم يكن هناك أفلام؟
        <div className="text-center col-span-full py-10">
          <h2 className="text-2xl font-semibold">No movies found</h2>
          <p className="text-muted-foreground mt-2">
            We couldn&apos;t find any movies matching your search. Please try a
            different keyword.
          </p>
        </div>
      )}
      {/* --- قسم التحكم بالصفحات المحدث --- */}
      <div className="flex justify-center items-center gap-4 mt-8">
        <Button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <form onSubmit={handleGoToPage} className="flex items-center gap-2">
          <Input
            type="number"
            value={pageInput}
            onChange={(e) => setPageInput(e.target.value)}
            className="w-16 text-center"
          />
        </form>
        <Button onClick={() => handlePageChange(currentPage + 1)}>Next</Button>
      </div>
    </main>
  );
}

// المكون الرئيسي الذي يغلف كل شيء بـ Suspense
export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MovieSearchPage />
    </Suspense>
  );
}
