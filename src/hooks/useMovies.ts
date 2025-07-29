// hooks/useMovies.ts
import { useState, useEffect } from "react";
import axios from "axios";

// --- هذا هو الجزء المفقود ---
export interface Movie {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
}
// -----------------------------

interface UseMoviesProps {
  query?: string;
  page?: number;
  genre?: string;
  year?: string;
}

export function useMovies({ query, page = 1, genre, year }: UseMoviesProps) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovies = async () => {
      setIsLoading(true);
      setError(null);
      
      const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
      const API_BASE_URL = "https://api.themoviedb.org/3";
      
      let endpoint = "/movie/popular";
      const params = new URLSearchParams({
        api_key: API_KEY || "",
        language: "en-US",
        page: page.toString(),
      });

      if (query) {
        endpoint = "/search/movie";
        params.append("query", query);
      } else if (genre || year) {
        endpoint = "/discover/movie";
        if (genre) params.append("with_genres", genre);
        if (year) params.append("primary_release_year", year);
      }
      
      const url = `${API_BASE_URL}${endpoint}?${params.toString()}`;

      try {
        const response = await axios.get(url);
        setMovies(response.data.results);
        setTotalPages(Math.min(response.data.total_pages, 500));
      } catch (err) {
        console.error("Failed to fetch movies:", err);
        setError("Failed to load movies.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovies();
  }, [query, page, genre, year]);

  return { movies, totalPages, isLoading, error };
}