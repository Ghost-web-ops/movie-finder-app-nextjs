import axios from 'axios';
import Image from 'next/image';

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
}

export default async function MovieDetailPage({ params }: { params: { id: string } }) {
  const movie: MovieDetails = await getMovieDetails(params.id);

  if (!movie) {
    return <div>Movie not found.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold my-4">{movie.title}</h1>
      <p className="text-lg text-muted-foreground mb-4">{movie.overview}</p>
      
      <div className="flex gap-4 mb-4">
        {movie.genres.map(genre => (
          <span key={genre.id} className="px-2 py-1 bg-secondary text-secondary-foreground rounded-md text-sm">
            {genre.name}
          </span>
        ))}
      </div>

      <Image
        src={`https://image.tmdb.org/t/p/w1280${movie.backdrop_path || movie.poster_path}`}
        alt={movie.title}
        width={1280}
        height={720}
        className="w-full h-auto object-cover rounded-lg"
      />
    </div>
  );
}