// components/ScrollableCast.tsx
"use client";

import Image from "next/image";
import { useRef } from "react";
import { ScrollButtons } from "./ScrollButtons";

interface CastMember {
  id: number;
  name: string;
  profile_path: string;
}

interface Props {
  cast: CastMember[];
}

export default function ScrollableCast({ cast }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  

  return (
    <div className="mt-10 pt-6 border-t dark:border-gray-800 border-gray-200">
      {/* العنوان والأزرار جنب بعض */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold dark:text-white text-gray-800">Top Cast</h2>
        <ScrollButtons scrollRef={scrollRef} />
      </div>
      {/* قائمة الممثلين */}
      <div
        ref={scrollRef}
        className="flex overflow-x-auto gap-4 pb-4 no-scrollbar px-10"
      >
        {cast.slice(0, 15).map((actor) =>
          actor.profile_path ? (
            <div key={actor.id} className="flex-shrink-0 w-32 text-center">
              <Image
                src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`}
                alt={actor.name}
                width={185}
                height={278}
                className="rounded-lg object-cover w-full h-auto mb-2"
              />
              <p className="font-semibold text-sm dark:text-gray-400 text-gray-800 truncate">
                {actor.name}
              </p>
            </div>
          ) : null
        )}
      </div>
    </div>
  );
}
