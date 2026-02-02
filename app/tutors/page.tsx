import { studentApi } from "@/api/student";
import TutorFilters from "@/components/tutors/TutorFilters";
import { Category, PaginatedResponse, TutorProfile } from "@/lib/types";
import {
  BookOpen,
  ChevronRight,
  GraduationCap,
  MapPin,
  Search,
  Star,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

export default async function TutorListPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const search = (params.search as string) || "";
  const categoryId = (params.category as string) || "";

  const tutorsRes = await studentApi.browseTutors({
    search: search || undefined,
    categoryId: categoryId || undefined,
  });
  const categoriesRes = await studentApi.listCategories();

  if (tutorsRes.error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-20">
        <div className="text-center p-8 bg-white rounded-3xl shadow-sm border border-red-100">
          <p className="text-red-500 font-bold text-xl mb-2">
            Error loading tutors
          </p>
          <p className="text-slate-500">{tutorsRes.error}</p>
        </div>
      </div>
    );
  }

  const tutorsData = tutorsRes.data as PaginatedResponse<TutorProfile> | null;
  const tutors =
    tutorsData?.data || (Array.isArray(tutorsData) ? tutorsData : []);
  const categories = ((categoriesRes.data as unknown as Category[]) || []).map(
    (c) => c.name,
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-4 font-outfit">
            Find Your Perfect <span className="text-blue-600">Tutor</span>
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto font-medium">
            Browse through our verified experts and book a session that fits
            your schedule.
          </p>
        </header>

        <TutorFilters categories={categories} />

        <Suspense fallback={<div>Loading tutors...</div>}>
          {tutors.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {tutors.map((tutor) => {
                const avgRating =
                  tutor.avgRating ??
                  (tutor.reviews?.length
                    ? tutor.reviews.reduce(
                        (acc: number, r: { rating: number }) => acc + r.rating,
                        0,
                      ) / tutor.reviews.length
                    : 0);

                return (
                  <Link
                    key={tutor.tutorId}
                    href={`/tutors/${tutor.tutorId}`}
                    className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group flex flex-col h-full"
                  >
                    <div className="relative h-48 bg-blue-600">
                      <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
                      {tutor.user?.image && (
                        <Image
                          src={tutor.user.image}
                          alt=""
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      )}
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-white text-xs font-black uppercase tracking-wider border border-white/30">
                          {tutor.category?.name}
                        </span>
                      </div>
                      <div className="absolute bottom-4 left-4 flex items-center gap-1.5">
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              className={`w-3.5 h-3.5 ${s <= avgRating ? "fill-amber-400 text-amber-400" : "text-white/40"}`}
                            />
                          ))}
                        </div>
                        <span className="text-white text-xs font-bold">
                          ({tutor.reviewsCount ?? tutor._count?.reviews ?? 0})
                        </span>
                      </div>
                    </div>

                    <div className="p-6 flex-1 flex flex-col">
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors tracking-tight mb-1">
                        {tutor.user?.name}
                      </h3>
                      <div className="flex flex-wrap gap-1 mb-4">
                        <BookOpen className="w-4 h-4 text-blue-600 mt-0.5" />
                        {tutor.subjects.slice(0, 2).map((s: string) => (
                          <span
                            key={s}
                            className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-md text-xs font-bold"
                          >
                            {s}
                          </span>
                        ))}
                        {tutor.subjects.length > 2 && (
                          <span className="text-xs text-gray-400 font-bold self-center">
                            +{tutor.subjects.length - 2}
                          </span>
                        )}
                      </div>

                      <div className="space-y-2 mb-6">
                        <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                          <GraduationCap className="w-4 h-4" />{" "}
                          {tutor.experience} Years Experience
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                          <MapPin className="w-4 h-4" />{" "}
                          {tutor.address?.split(",")[0] ?? "N/A"}
                        </div>
                      </div>

                      <div className="mt-auto pt-6 border-t border-gray-50 flex items-center justify-between">
                        <div>
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">
                            Price per day
                          </p>
                          <p className="text-xl font-black text-gray-900 mt-1">
                            BDT {tutor.pricePerDay}
                          </p>
                        </div>
                        <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                          <ChevronRight className="w-6 h-6" />
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-10 h-10 text-gray-300" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                No tutors found
              </h2>
              <p className="text-gray-500 max-w-sm mx-auto font-medium">
                Try adjusting your search terms or filters to find what
                you&apos;re looking for.
              </p>
              <Link
                href="/tutors"
                className="mt-6 text-blue-600 font-extrabold hover:underline inline-block"
              >
                Clear all filters
              </Link>
            </div>
          )}
        </Suspense>
      </div>
    </div>
  );
}
