import axios from 'axios';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge'; // سنحتاج هذا المكون الجديد

// دالة لجلب تفاصيل فيلم واحد
async function getMovieDetails(id: string) {
  const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
  const url = `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&language=en-US`;
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch movie details:", error);
    return null;
  }
}

// تعريف شكل بيانات الفيلم المفصلة
interface MovieDetails {
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  vote_average: number;
  release_date: string;
  genres: { id: number; name: string }[];
  tagline: string;
}

export default async function MovieDetailPage({ params }: { params: { id: string } }) {
  const movie: MovieDetails | null = await getMovieDetails(params.id);

  if (!movie) {
    return <div className="text-center py-10">Movie not found.</div>;
  }

  return (
    <>
      {/* Background Image Section */}
      <div className="relative w-full h-80 md:h-96">
        <Image
          src={`https://image.tmdb.org/t/p/w1280${movie.backdrop_path || movie.poster_path}`}
          alt={`${movie.title} backdrop`}
          layout="fill"
          objectFit="cover"
          className="opacity-20"
        />
      </div>

      {/* Main Content Section */}
      <main className="container mx-auto p-4 -mt-48 md:-mt-56 relative z-10">
        <div className="grid md:grid-cols-3 gap-8">
          
          {/* Movie Poster */}
          <div className="md:col-span-1">
            <Image
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              width={500}
              height={750}
              className="w-full h-auto object-cover rounded-lg shadow-2xl"
            />
          </div>

          {/* Movie Details */}
          <div className="md:col-span-2">
            <h1 className="text-4xl font-bold">{movie.title}</h1>
            <p className="text-lg text-muted-foreground italic my-2">{movie.tagline}</p>
            
            <div className="flex flex-wrap gap-2 my-4">
              {movie.genres.map(genre => (
                <Badge key={genre.id} variant="secondary">
                  {genre.name}
                </Badge>
              ))}
            </div>

            <h2 className="text-2xl font-semibold mt-6 mb-2">Overview</h2>
            <p className="text-foreground/80 leading-relaxed">{movie.overview}</p>

            <div className="flex items-center gap-4 mt-6">
                <span className="font-bold text-lg">Rating: {movie.vote_average.toFixed(1)} / 10</span>
                <span className="text-muted-foreground">|</span>
                <span className="text-lg">Release Date: {movie.release_date}</span>
            </div>
          </div>

        </div>
      </main>
    </>
  );
}