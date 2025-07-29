// components/FilterControls.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "./ui/button";

interface Genre {
  id: number;
  name: string;
}

// Function to generate a list of years
const generateYears = () => {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let year = currentYear; year >= 1950; year--) {
    years.push(year);
  }
  return years;
};

export function FilterControls() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [genres, setGenres] = useState<Genre[]>([]);
  const years = generateYears();

  // Fetch genres from TMDB API
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await axios.get(`https://api.themoviedb.org/3/genre/movie/list?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US`);
        setGenres(response.data.genres);
      } catch (error) {
        console.error("Failed to fetch genres:", error);
      }
    };
    fetchGenres();
  }, []);

  const handleFilterChange = (key: 'genre' | 'year', value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    // When a filter changes, always go back to page 1
    params.set("page", "1");
    // Also, remove the search query if a filter is applied
    params.delete("query");
    router.push(`/?${params.toString()}`);
  };

  const clearFilters = () => {
    router.push('/');
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-8 max-w-xl mx-auto">
      {/* Genre Filter */}
      <Select onValueChange={(value) => handleFilterChange('genre', value)} value={searchParams.get('genre') || ''}>
        <SelectTrigger><SelectValue placeholder="Filter by Genre" /></SelectTrigger>
        <SelectContent>
          {genres.map(genre => (
            <SelectItem key={genre.id} value={genre.id.toString()}>{genre.name}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Year Filter */}
      <Select onValueChange={(value) => handleFilterChange('year', value)} value={searchParams.get('year') || ''}>
        <SelectTrigger><SelectValue placeholder="Filter by Year" /></SelectTrigger>
        <SelectContent>
          {years.map(year => (
            <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      {/* Clear Button */}
      {(searchParams.get('genre') || searchParams.get('year')) && (
         <Button variant="ghost" onClick={clearFilters}>Clear Filters</Button>
      )}
    </div>
  );
}