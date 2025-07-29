import axios from 'axios';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge'; // سنحتاج هذا المكون الجديد

// دالة لجلب تفاصيل فيلم واحد
async function getMovieDetails(id: string) {
  const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
  // Use append_to_response to get credits and videos
  const url = `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&language=en-US&append_to_response=credits,videos`;
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
  credits: {
    cast: { id: number; name: string; profile_path: string; character: string }[];
  };
  videos: {
    results: { key: string; name: string; site: string; type: string }[];
  };
}

export default async function MovieDetailPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const movie: MovieDetails | null = await getMovieDetails(params.id);
    console.log("Available videos:", movie?.videos?.results); 


  if (!movie) {
    return <div className="text-center py-10">Movie not found.</div>;
  }
// Find the official trailer first
let trailer = movie.videos.results.find(v => v.type === 'Trailer' && v.site === 'YouTube');

// If no official trailer is found, grab the first available YouTube video as a fallback
if (!trailer) {
  trailer = movie.videos.results.find(v => v.site === 'YouTube');
}  return (
 <>
  {/* Background Image Section - Simplified for Light Mode */}
  <div className="relative w-full h-[40vh]">
    <Image
      src={`https://image.tmdb.org/t/p/w1280${movie.backdrop_path || movie.poster_path}`}
      alt={`${movie.title} backdrop`}
      fill
      priority
      className="object-cover object-top opacity-25" // Opacity adjusted for a light background
    />
  </div>

  {/* Main Content Section */}
  <main className="container mx-auto p-4 md:p-8 relative -mt-[15vh]">
    <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
      
      {/* --- COLUMN 1: Movie Poster --- */}
      <div className="md:col-span-1">
        <Image
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          width={500}
          height={750}
          // Subtle shadow for light backgrounds
          className="w-full h-auto object-cover rounded-xl shadow-lg shadow-black/10"
        />
      </div>

      {/* --- COLUMN 2: All Movie Details --- */}
      <div className="md:col-span-2">
        {/* Dark text for high contrast on white background */}
        <h1 className="text-4xl lg:text-5xl font-extrabold dark:text-white text-gray-900">{movie.title}</h1>
        <p className="text-lg text-gray-500 dark:text-gray-400 italic my-2">{movie.tagline}</p>
        
        <div className="flex flex-wrap gap-2 my-6">
          {movie.genres.map(genre => (
            // Light badges with dark text
            <Badge key={genre.id} className="bg-gray-200 text-gray-800">
              {genre.name}
            </Badge>
          ))}
        </div>

        <div className="flex items-center gap-6 my-6 p-4 dark:bg-gray-900 bg-gray-50 rounded-lg">
            <div className="flex items-center  gap-2">
              <span className="text-yellow-500 dark:text-white text-xl">⭐</span>
              <span className="font-bold text-lg dark:text-white text-gray-800">{movie.vote_average.toFixed(1)} <span className="text-sm dark:text-white text-gray-500">/ 10</span></span>
            </div>
            <div className="flex items-center gap-2">
               <span className="text-gray-500 text-base">{movie.release_date?.substring(0, 4)}</span>
            </div>
        </div>

        <h2 className="text-2xl font-bold mt-8 mb-3 dark:text-white text-gray-800">Overview</h2>
        {/* Standard text color for readability */}
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{movie.overview}</p>

        {/* --- Horizontal Scrolling Cast --- */}
        <div className="mt-10 pt-6 border-t dark:border-gray-800 border-gray-200">
          <h2 className="text-2xl font-bold mb-4 dark:text-white text-gray-800">Top Cast</h2>
          <div className="flex overflow-x-auto gap-4 pb-4">
            {movie.credits.cast.slice(0, 15).map(actor => (
              actor.profile_path && (
                <div key={actor.id} className="flex-shrink-0 w-32 text-center">
                  <Image
                    src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`}
                    alt={actor.name}
                    width={185}
                    height={278}
                    className="rounded-lg object-cover w-full h-auto mb-2"
                  />
                  <p className="font-semibold text-sm dark:text-gray-400 text-gray-800 truncate">{actor.name}</p>
                </div>
              )
            ))}
          </div>
        </div>

        {/* --- Trailer Section --- */}
        {trailer && (
          <div className="mt-10 pt-6 border-t border-gray-200">
            <h2 className="text-2xl font-bold mb-4 dark:text-white text-gray-800">Trailer</h2>
            <div className="aspect-[16/9] w-full">
              <iframe
                src={`https://www.youtube.com/embed/${trailer.key}`}
                title="Movie Trailer"
                allowFullScreen
                className="w-full h-full rounded-xl shadow-lg"
              ></iframe>
            </div>
          </div>
        )}
      </div>
    </div>
  </main>
</>

  );
}