// components/MovieComponents.tsx
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Movie } from "@/hooks/useMovies"; // Import from our new hook file

// A. Movie Card Component
export function MovieCard({ movie }: { movie: Movie }) {
  if (!movie.poster_path) return null; // Don't render if there's no poster

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Link href={`/movies/${movie.id}`} className="group">
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
          <Skeleton count={2} style={{ marginTop: '8px' }} />
        </div>
      ))}
    </div>
  );
}

// C. Error/No Results Component
export function MessageDisplay({ message, subMessage }: { message: string, subMessage?: string }) {
    return (
        <div className="text-center col-span-full py-10">
            <h2 className="text-2xl font-semibold">{message}</h2>
            {subMessage && <p className="text-muted-foreground mt-2">{subMessage}</p>}
        </div>
    );
}