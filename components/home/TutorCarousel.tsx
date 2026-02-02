"use client";

import useEmblaCarousel, { UseEmblaCarouselType } from "embla-carousel-react";
import { ChevronLeft, ChevronRight, Star, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

interface Tutor {
  tutorId: string;
  subject: string;
  experience: number;
  pricePerDay: number;
  avgRating: number;
  reviewsCount: number;
  user: {
    name: string;
    image: string | null;
  };
  category: {
    name: string;
  };
}

export default function TutorCarousel({ tutors }: { tutors: Tutor[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: true,
    skipSnaps: false,
    dragFree: true,
  });

  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
  const [nextBtnEnabled, setNextBtnEnabled] = useState(false);

  const scrollPrev = useCallback(
    () => emblaApi && emblaApi.scrollPrev(),
    [emblaApi],
  );
  const scrollNext = useCallback(
    () => emblaApi && emblaApi.scrollNext(),
    [emblaApi],
  );

  type EmblaApiType = UseEmblaCarouselType[1];

  const onSelect = useCallback((api: EmblaApiType) => {
    if (!api) return;
    setPrevBtnEnabled(api.canScrollPrev());
    setNextBtnEnabled(api.canScrollNext());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect(emblaApi);
    emblaApi.on("reInit", onSelect);
    emblaApi.on("select", onSelect);
  }, [emblaApi, onSelect]);

  return (
    <div className="relative group/carousel">
      {/* Navigation Buttons */}
      <div className="absolute -top-15 right-0 flex gap-4">
        <button
          onClick={scrollPrev}
          className={`p-4 rounded-2xl border-2 transition-all duration-300 flex items-center justify-center ${
            prevBtnEnabled
              ? "border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white cursor-pointer"
              : "border-slate-200 text-slate-200 cursor-not-allowed"
          }`}
          disabled={!prevBtnEnabled}
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={scrollNext}
          className={`p-4 rounded-2xl border-2 transition-all duration-300 flex items-center justify-center ${
            nextBtnEnabled
              ? "border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white cursor-pointer"
              : "border-slate-200 text-slate-200 cursor-not-allowed"
          }`}
          disabled={!nextBtnEnabled}
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Carousel Viewport */}
      <div
        className="overflow-hidden cursor-grab active:cursor-grabbing"
        ref={emblaRef}
      >
        <div className="flex gap-8 py-4 px-2 -ml-4">
          {tutors.map((tutor) => (
            <div
              key={tutor.tutorId}
              className="flex-[0_0_100%] sm:flex-[0_0_50%] lg:flex-[0_0_33.33%] pl-4 min-w-0"
            >
              <div className="group/card bg-slate-50 rounded-[40px] p-6 border border-slate-100 hover:bg-white hover:shadow-[0_20px_60px_-15px_rgba(30,58,138,0.15)] hover:-translate-y-2 transition-all duration-500 h-full flex flex-col">
                <div className="relative mb-6 shrink-0">
                  <div className="aspect-4/3 rounded-[32px] bg-blue-100 overflow-hidden relative shadow-lg">
                    {tutor.user.image ? (
                      <Image
                        src={tutor.user.image}
                        alt={tutor.user.name}
                        fill
                        className="object-cover group-hover/card:scale-110 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Users className="w-16 h-16 text-blue-600 opacity-20" />
                      </div>
                    )}
                    <div className="absolute top-4 right-4 px-4 py-1.5 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-slate-900 shadow-sm">
                      {tutor.category.name}
                    </div>
                  </div>
                </div>

                <div className="flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <h3 className="text-2xl font-black text-slate-900 group-hover/card:text-blue-600 transition-colors line-clamp-1 font-outfit">
                        {tutor.user.name}
                      </h3>
                      <div className="flex items-center gap-1.5 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-100">
                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                        <span className="text-amber-800 font-black text-sm">
                          {tutor.avgRating.toFixed(1)}
                        </span>
                      </div>
                    </div>
                    <p className="text-blue-600 font-extrabold text-sm uppercase tracking-widest">
                      {tutor.subject}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-slate-200/60">
                    <div className="space-y-0.5">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none mb-1">
                        Starting at
                      </p>
                      <p className="text-2xl font-black text-slate-900">
                        BDT {tutor.pricePerDay}
                        <span className="text-sm text-slate-400 font-bold ml-1">
                          /day
                        </span>
                      </p>
                    </div>
                    <Link
                      href={`/tutors/${tutor.tutorId}`}
                      className="px-6 py-3.5 bg-slate-900 text-white text-sm font-black rounded-2xl hover:bg-blue-600 hover:shadow-xl hover:shadow-blue-900/20 transition-all duration-300"
                    >
                      View Profile
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
