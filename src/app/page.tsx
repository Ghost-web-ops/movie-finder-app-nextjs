"use client";
import { useState, useEffect, FormEvent } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface Movie { id: number; title: string; poster_path: string; release_date: string; }

export default function Home() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [currentSearch, setCurrentSearch] = useState('');

  const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;

  useEffect(() => {
    const fetchPopular = async () => {
      setIsLoading(true);
      try {
        const url = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-US&page=${currentPage}`;
        const response = await axios.get(url);
        setMovies(response.data.results);
      } catch (error) {
        console.error("Failed to fetch movies:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPopular();
  }, [apiKey, currentPage]);

  const fetchSearchedMovies = async (query: string, page: number) => {
    if (query.trim() === '') return;
    setIsLoading(true);
    try {
        const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}&language=en-US&page=${page}`;
        const response = await axios.get(url);
        setMovies(response.data.results);
    } catch (error) {
      console.error("Failed to search movies:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to page 1 for new search
    setCurrentSearch(searchQuery);
    fetchSearchedMovies(searchQuery, 1);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1) return;
    setCurrentPage(newPage);
    if(currentSearch) {
        fetchSearchedMovies(currentSearch, newPage);
    }
  }

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Movie Discovery</h1>
      
      <form onSubmit={handleSearch} className="flex max-w-xl mx-auto mb-4">
        <Input type="text" placeholder="Search for a movie..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="rounded-r-none"/>
        <Button type="submit" className="rounded-l-none">Search</Button>
      </form>

      {/* Pagination Controls */}
      <div className="flex justify-center items-center gap-4 mb-8">
        <Button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>Previous</Button>
        <span>Page {currentPage}</span>
        <Button onClick={() => handlePageChange(currentPage + 1)}>Next</Button>
      </div>

      {isLoading ? ( <p className="text-center">Loading...</p> ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {movies.map((movie) => (
            movie.poster_path && (
              <Link href={`/movies/${movie.id}`} key={movie.id}>
                <div className="group">
                  <div className="overflow-hidden rounded-lg">
                    <Image src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} width={500} height={750} className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"/>
                  </div>
                  <h3 className="mt-2 text-sm font-semibold text-foreground truncate">{movie.title}</h3>
                  <p className="text-xs text-muted-foreground">{movie.release_date?.substring(0, 4)}</p>
                </div>
              </Link>
            )
          ))}
        </div>
      )}
    </main>
  );
}