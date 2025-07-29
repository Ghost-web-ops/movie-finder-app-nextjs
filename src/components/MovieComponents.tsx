// components/MovieComponents.tsx
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Movie } from "@/hooks/useMovies"; // Import from our new hook file
import { useFavorites } from "@/hooks/useFavorites";
import { Button } from "./ui/button";

// A. Movie Card Component - Updated
export function MovieCard({ movie }: { movie: Movie }) {
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  const isFav = isFavorite(movie.id);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigating to the movie details page
    e.stopPropagation(); // Stop the event from bubbling up
    if (isFav) {
      removeFavorite(movie.id);
    } else {
      addFavorite(movie.id);
    }
  };
  if (!movie.poster_path) return null; // Don't render if there's no poster

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="relative group" // Add relative positioning
    >
      {/* Favorite Button */}
      <Button
        size="icon"
        variant="ghost"
        className="absolute top-2 right-2 z-10 bg-black/50 text-white hover:bg-black/70 hover:text-white"
        onClick={handleFavoriteClick}
      >
        {isFav ? (
          // Filled Heart Icon
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="text-red-500"
          >
            <path d="M12 20.325q-.35 0-.713-.125t-.637-.4l-1.725-1.575q-2.65-2.425-4.288-4.85t-1.637-4.25q0-2.725 1.738-4.462T8.6 3q1.475 0 2.8.813t2.1 2.137q.775-1.325 2.1-2.137T18.4 3q2.725 0 4.463 1.738T24.6 9.2q0 1.825-.925 3.537T19.35 17.6l-1.725 1.575q-.275.275-.637.4t-.713.125" />
          </svg>
        ) : (
          // Outline Heart Icon
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
          </svg>
        )}
      </Button>

      <Link href={`/movies/${movie.id}`} className="block">
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
        <p className="text-xs text-yellow-500">
          ⭐ {movie.vote_average.toFixed(1)} / 10
        </p>
      </Link>
    </motion.div>
  );
}

// B. Loading Skeleton Component
export function LoadingState() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {Array.from({ length: 10 }).map((_, index) => (
        <div key={index}>
          <Skeleton height={250} />
          <Skeleton count={2} style={{ marginTop: "8px" }} />
        </div>
      ))}
    </div>
  );
}

// C. Error/No Results Component
// C. Error/No Results Component - UPDATED
export function MessageDisplay({
  message,
  subMessage,
}: {
  message: string;
  subMessage?: string;
}) {
  return (
    // هذه الحاوية ستنمو الآن وتوسط محتواها
    <div className="flex-grow flex flex-col items-center justify-center text-center p-4">
      <h2 className="text-2xl font-semibold">{message}</h2>
      {subMessage && (
        <p className="text-muted-foreground mt-2 max-w-sm">{subMessage}</p>
      )}
    </div>
  );
}
