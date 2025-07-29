// hooks/useMovies.ts
import { useState, useEffect } from "react";
import axios from "axios";

// Define the shape of a movie object
export interface Movie {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
}

// Define the shape of the API response
interface ApiResponse {
  results: Movie[];
  total_pages: number;
}

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const API_BASE_URL = "https://api.themoviedb.org/3";

export function useMovies(query: string, page: number) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovies = async () => {
      setIsLoading(true);
      setError(null);

      // Determine the URL based on whether there is a search query
      const endpoint = query ? "/search/movie" : "/movie/popular";
      const params = new URLSearchParams({
        api_key: API_KEY || "",
        language: "en-US",
        page: page.toString(),
      });
      if (query) {
        params.append("query", query);
      }

      const url = `${API_BASE_URL}${endpoint}?${params.toString()}`;

      try {
        const response = await axios.get<ApiResponse>(url);
        if (response.data.results.length === 0 && query) {
            setError("No movies found for your search.");
        }
        setMovies(response.data.results);
        // Prevent total_pages from exceeding 500 as per TMDB API docs
        setTotalPages(Math.min(response.data.total_pages, 500));
      } catch (err) {
        console.error("Failed to fetch movies:", err);
        setError("Failed to load movies. Please check your connection or try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    if (API_KEY) {
        fetchMovies();
    } else {
        setError("API Key is missing. Please check your environment variables.");
        setIsLoading(false);
    }
  }, [query, page]);

  return { movies, totalPages, isLoading, error };
}