import { studentApi } from "@/api/student";
import { Users } from "lucide-react";
import Link from "next/link";
import TutorCarousel from "./TutorCarousel";

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

export default async function FeaturedTutors() {
  const { data: result, error } = await studentApi.browseTutors({
    limit: 12,
    onlyFeatured: true,
    onlyAvailable: true,
  });

  if (error || !result) {
    return null;
  }

  const tutors = (result.data || []) as Tutor[];

  if (tutors.length === 0) return null;

  return (
    <section className="py-24 bg-white overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-slate-200 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full border border-blue-100">
              <StarIcon className="w-4 h-4 fill-blue-600" />
              <span className="text-xs font-black uppercase tracking-widest">
                Our Top Selection
              </span>
            </div>
            <h2 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight font-outfit">
              Featured <span className="text-blue-600">Educators</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl font-medium leading-relaxed">
              Connect with our most highly-rated experts, handpicked for their
              exceptional teaching standards and student success rates.
            </p>
          </div>
          <Link
            href="/tutors"
            className="inline-flex items-center justify-center px-8 py-4 bg-slate-50 text-slate-900 font-black rounded-2xl hover:bg-slate-900 hover:text-white transition-all duration-300 group border border-slate-200 hover:border-slate-900"
          >
            Browse All Tutors
            <Users className="ml-3 w-5 h-5 group-hover:scale-110 transition-transform" />
          </Link>
        </div>

        <TutorCarousel tutors={tutors} />
      </div>

      <div className="absolute bottom-0 left-0 w-full h-px bg-linear-to-r from-transparent via-slate-200 to-transparent" />
    </section>
  );
}

function StarIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
