"use client"; // <-- Step 1: Convert to a Client Component

import { useState, useEffect, FormEvent } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { Input } from '@/components/ui/input'; // Assuming you have Input from shadcn
import { Button } from '@/components/ui/button'; // Assuming you have Button from shadcn
import  Link  from 'next/link';
// تعريف شكل بيانات الفيلم
interface Movie {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
}

export default function Home() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;

  // دالة لجلب البيانات
  const fetchMovies = async (url: string) => {
    setIsLoading(true);
    try {
      const response = await axios.get(url);
      setMovies(response.data.results);
    } catch (error) {
      console.error("Failed to fetch movies:", error);
      setMovies([]);
    } finally {
      setIsLoading(false);
    }
  };

  // جلب الأفلام الأكثر شهرة عند تحميل الصفحة لأول مرة
  useEffect(() => {
    const popularMoviesUrl = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-US&page=1`;
    fetchMovies(popularMoviesUrl);
  }, [apiKey]); // Run only once on mount

  // دالة للبحث عن الأفلام
  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim() === '') {
      // If search is empty, show popular movies again
      const popularMoviesUrl = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-US&page=1`;
      fetchMovies(popularMoviesUrl);
      return;
    }
    const searchUrl = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(searchQuery)}&language=en-US&page=1`;
    fetchMovies(searchUrl);
  };

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Movie Discovery</h1>
      
      {/* Search Form */}
      <form onSubmit={handleSearch} className="flex max-w-xl mx-auto mb-8">
        <Input
          type="text"
          placeholder="Search for a movie..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="rounded-r-none"
        />
        <Button type="submit" className="rounded-l-none">Search</Button>
      </form>

      {/* Movie Grid */}
      {isLoading ? (
        <p className="text-center">Loading...</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {movies.map((movie) => (
            movie.poster_path && ( // Only display movies that have a poster
              <div key={movie.id} className="rounded-lg overflow-hidden">
                <Link href={`/movies/${movie.id}`}>
                <Image
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  width={500}
                  height={750}
                  className="w-full h-auto object-cover"
                />
                </Link>
              </div>
            )
          ))}
        </div>
      )}
    </main>
  );
}