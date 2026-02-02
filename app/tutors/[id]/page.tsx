import { studentApi } from "@/api/student";
import BookingForm from "@/components/tutors/BookingForm";
import { Tutor } from "@/lib/types";
import {
  ChevronLeft,
  MapPin,
  MessageSquare,
  School,
  Star,
  Users,
} from "lucide-react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const res = await studentApi.getTutorDetails(id);
  const tutor = res.data as Tutor | null;

  if (!tutor) {
    return {
      title: "Tutor Not Found | Skill Bridge",
    };
  }

  return {
    title: `${tutor.user?.name || "Tutor"} | expert in ${(tutor.subjects || []).join(", ")} | Skill Bridge`,
    description:
      tutor.bio ||
      `Learn from ${tutor.user?.name || "our expert tutor"} on Skill Bridge.`,
  };
}

export default async function TutorDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { data: tutor, error } = await studentApi.getTutorDetails(id);

  if (error || !tutor) {
    notFound();
  }

  const typedTutor = tutor as Tutor;
  const reviews = typedTutor.reviews ?? [];

  const avgRating = reviews.length
    ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
    : 0;

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/tutors"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-blue-600 font-bold mb-8 transition-colors group"
        >
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />{" "}
          Back to Tutors
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column: Tutor Info */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-4xl shadow-sm border border-slate-100">
              <div className="p-8 flex flex-col md:flex-row items-start gap-8">
                <div className="w-32 h-32 bg-blue-100 rounded-3xl shrink-0 overflow-hidden relative shadow-lg shadow-blue-50 border-4 border-white">
                  {typedTutor.user?.image ? (
                    <Image
                      src={typedTutor.user.image}
                      alt=""
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <Users className="w-16 h-16 text-blue-600 m-auto mt-8" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight font-outfit">
                      {typedTutor.user?.name ?? "Unknown Tutor"}
                    </h1>
                    <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-black uppercase tracking-wider border border-blue-100">
                      {typedTutor.category?.name ?? "General"}
                    </span>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-2xl border border-gray-100">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      Pricing
                    </p>
                    <p className="text-lg font-black text-gray-900">
                      BDT {typedTutor.pricePerDay}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 font-semibold">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-blue-600" />{" "}
                    {typedTutor.address}
                  </div>
                  {typedTutor.institute && (
                    <div className="flex items-center gap-2">
                      <School className="w-4 h-4 text-blue-600" />{" "}
                      {typedTutor.institute}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <section className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 font-outfit">
                About Me
              </h2>
              <p className="text-gray-600 font-medium leading-relaxed whitespace-pre-wrap">
                {typedTutor.bio || "No biography provided."}
              </p>
            </section>

            <section className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-900 font-outfit">
                  Student Reviews
                </h2>
                <div className="flex items-center gap-1.5 px-4 py-2 bg-amber-50 rounded-xl">
                  <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                  <span className="text-amber-700 font-black">
                    {avgRating.toFixed(1)} / 5.0
                  </span>
                </div>
              </div>

              {reviews.length > 0 ? (
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div
                      key={review.id}
                      className="p-6 bg-gray-50 rounded-3xl border border-gray-100 group"
                    >
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-10 h-10 bg-white rounded-xl shadow-sm overflow-hidden flex items-center justify-center shrink-0 border border-gray-100 relative">
                          {review.student?.user?.image ? (
                            <Image
                              src={review.student.user.image}
                              alt=""
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <Users className="w-6 h-6 text-gray-300" />
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">
                            {review.student?.user?.name ?? "Anonymous"}
                          </p>
                          <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="ml-auto flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              className={`w-3.5 h-3.5 ${s <= review.rating ? "fill-amber-400 text-amber-400" : "text-gray-200"}`}
                            />
                          ))}
                        </div>
                      </div>
                      <div className="relative pl-6">
                        <MessageSquare className="w-4 h-4 text-gray-300 absolute left-0 top-1" />
                        <p className="text-gray-600 italic font-medium">
                          &ldquo;{review.comment}&rdquo;
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-100">
                  <p className="text-gray-400 font-bold">
                    No reviews yet for this tutor.
                  </p>
                </div>
              )}
            </section>
          </div>

          {/* Right Column: Booking Form */}
          <div className="lg:col-span-1">
            <BookingForm
              tutorId={typedTutor.tutorId}
              pricePerDay={typedTutor.pricePerDay}
              availableFrom={typedTutor.availableFrom ?? null}
              availableTo={typedTutor.availableTo ?? null}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
