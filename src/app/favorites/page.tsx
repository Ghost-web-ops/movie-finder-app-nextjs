"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useFavorites } from "@/hooks/useFavorites";
import { Movie } from "@/hooks/useMovies";
import { MovieCard, LoadingState, MessageDisplay } from "@/components/MovieComponents";

export default function FavoritesPage() {
  const { favorites } = useFavorites();
  const [favoriteMovies, setFavoriteMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // ... (your existing useEffect logic to fetch movies)
    const fetchFavoriteMovies = async () => {
      if (favorites.length === 0) {
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      const moviePromises = favorites.map(id =>
        axios.get(`https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`)
      );
      try {
        const responses = await Promise.all(moviePromises);
        setFavoriteMovies(responses.map(res => res.data));
      } catch (error) {
        console.error("Failed to fetch favorite movies", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFavoriteMovies();
  }, [favorites]);

  return (
    // أضف هذه الكلاسات لجعل الحاوية الرئيسية قادرة على توسيط المحتوى
    <div className="container mx-auto p-4 flex flex-col flex-grow">
      <h1 className="text-4xl font-bold mb-8">My Favorite Movies</h1>
      
      {isLoading && <LoadingState />}

      {!isLoading && favoriteMovies.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {favoriteMovies.map(movie => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}

      {/* هذه الرسالة ستظهر الآن في منتصف الصفحة */}
      {!isLoading && favoriteMovies.length === 0 && (
        <MessageDisplay message="No favorites yet!" subMessage="You can add movies to your favorites from the main page." />
      )}
    </div>
  );
}