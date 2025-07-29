// app/movies/[id]/loading.tsx
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default function MovieDetailLoading() {
  return (
    <main className="container mx-auto p-4 mt-10">
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <Skeleton height={450} />
        </div>
        <div className="md:col-span-2">
          <Skeleton height={40} width="80%" />
          <Skeleton height={20} width="50%" className="my-2" />
          <Skeleton count={5} />
        </div>
      </div>
    </main>
  );
}