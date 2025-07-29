import axios from "axios";
import Image from "next/image";
import { Badge } from "@/components/ui/badge"; // سنحتاج هذا المكون الجديد
import { SimilarMovies } from "@/components/SimilarMovies";
import type { Movie } from "@/hooks/useMovies";
import ScrollableCast from "@/components/ScrollableCast";

// دالة لجلب تفاصيل فيلم واحد
async function getMovieDetails(id: string) {
  const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
  // Use append_to_response to get credits and videos
  const url = `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&language=en-US&append_to_response=credits,videos,similar`;

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
    cast: {
      id: number;
      name: string;
      profile_path: string;
      character: string;
    }[];
  };
  videos: {
    results: { key: string; name: string; site: string; type: string }[];
  };
  // هذا هو السطر الذي تم إصلاحه
  similar?: {
    results: Movie[];
  };
}

export default async function MovieDetailPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const movie: MovieDetails | null = await getMovieDetails(params.id);
  console.log("Available videos:", movie?.videos?.results);

  if (!movie) {
    return <div className="text-center py-10">Movie not found.</div>;
  }
  // Find the official trailer first
  let trailer = movie.videos.results.find(
    (v) => v.type === "Trailer" && v.site === "YouTube"
  );

  // If no official trailer is found, grab the first available YouTube video as a fallback
  if (!trailer) {
    trailer = movie.videos.results.find((v) => v.site === "YouTube");
  }
  return (
    <>
       {/* قسم صورة الخلفية */}
  <div className="relative w-full h-[30vh] md:h-[40vh]">
    <Image
      src={`https://image.tmdb.org/t/p/w1280${movie.backdrop_path || movie.poster_path}`}
      alt={`${movie.title} backdrop`}
      fill
      priority
      className="object-cover object-top opacity-25"
    />
  </div>

  {/* قسم المحتوى الرئيسي */}
  {/* ملاحظة: تم تعديل الهيكل ليكون متجاوبًا */}
  <main className="container mx-auto p-4">
    {/* على الموبايل: لا يوجد هامش علوي سالب، المحتوى يظهر تحت الصورة.
      على الشاشات الأكبر (md): نضيف الهامش السالب لإنشاء تأثير التداخل.
    */}
    <div className="relative -mt-12 md:-mt-24 lg:-mt-32">
      {/* على الموبايل: المحتوى يترتب في عمود واحد (block).
        على الشاشات الأكبر (md): يتحول إلى شبكة من عمودين.
      */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
        
        {/* --- العمود الأول: بوستر الفيلم --- */}
        <div className="md:col-span-1">
          <Image
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            width={500}
            height={750}
            className="w-full max-w-xs mx-auto md:max-w-full h-auto object-cover rounded-xl shadow-lg"
          />
        </div>

        {/* --- العمود الثاني: كل تفاصيل الفيلم --- */}
        <div className="md:col-span-2">
          {/* على الموبايل: النص يكون في المنتصف ليتناسب مع البوستر.
            على الشاشات الأكبر (md): النص يعود إلى اليسار.
          */}
          <div className="text-center md:text-left">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold dark:text-white text-gray-900">
              {movie.title}
            </h1>
            <p className="text-md md:text-lg text-gray-500 dark:text-gray-400 italic my-2">
              {movie.tagline}
            </p>
          </div>

          <div className="flex flex-wrap gap-2 my-6 justify-center md:justify-start">
            {movie.genres.map((genre) => (
              <Badge key={genre.id} className="bg-gray-200 text-gray-800 dark:bg-gray-800 dark:text-gray-300">
                {genre.name}
              </Badge>
            ))}
          </div>

          {/* ... باقي الكود كما هو ... */}
          <div className="flex items-center justify-center md:justify-start gap-6 my-6 p-4 dark:bg-gray-900 bg-gray-50 rounded-lg">
            {/* ... */}
          </div>
          <h2 className="text-2xl font-bold mt-8 mb-3 dark:text-white text-gray-800 text-center md:text-left">
            Overview
          </h2>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            {movie.overview}
          </p>

          <ScrollableCast cast={movie.credits.cast} />

          {trailer && (
            <div className="mt-10 pt-6 border-t border-gray-200 dark:border-gray-800">
              <h2 className="text-2xl font-bold mb-4 dark:text-white text-gray-800">
                Trailer
              </h2>
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
    </div>
        <SimilarMovies movies={movie.similar?.results || []} />
      </main>
    </>
  );
}
