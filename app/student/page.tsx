import { authClient } from "@/api/betterAuth";
import { studentApi } from "@/api/student";
import RecentBookings from "@/components/student/RecentBookings";
import { Booking, PaginatedResponse, Review } from "@/lib/types";
import {
  ArrowRight,
  Award,
  Calendar,
  CheckCircle2,
  Clock,
  Star,
  TrendingUp,
} from "lucide-react";
import { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Student Dashboard | Skill Bridge",
  description: "Manage your tutoring bookings, reviews, and learning progress.",
};

interface StudentDashboardStats {
  bookings: {
    total: number;
    completed: number;
    pending: number;
  };
  reviews: {
    count: number;
  };
}

export default async function StudentDashboardPage() {
  const h = await headers();
  const cookie = h.get("cookie") || "";

  const [sessionRes, statsRes, bookingsRes, reviewsRes] = await Promise.all([
    authClient.getSession({ fetchOptions: { headers: { cookie } } }),
    studentApi.getDashboardStats({ cookie }),
    studentApi.listBookings({ limit: 5 }, { cookie }),
    studentApi.listReviews({ limit: 3 }, { cookie }),
  ]);

  const session = sessionRes.data;
  const stats = (statsRes.data as unknown as StudentDashboardStats) || {
    bookings: { total: 0, completed: 0, pending: 0 },
    reviews: { count: 0 },
  };
  const bookingsData = bookingsRes.data as PaginatedResponse<Booking>;
  const recentBookings = (bookingsData?.data || []).map((b: Booking) => ({
    ...b,
    id: b.bookingId || b.id,
  }));

  const reviewsRaw = reviewsRes.data;
  let reviewsArray: Review[] = [];
  if (reviewsRaw && typeof reviewsRaw === "object" && reviewsRaw !== null) {
    if (
      "data" in reviewsRaw &&
      Array.isArray((reviewsRaw as PaginatedResponse<Review>).data)
    ) {
      reviewsArray = (reviewsRaw as PaginatedResponse<Review>).data || [];
    } else if (Array.isArray(reviewsRaw)) {
      reviewsArray = reviewsRaw as Review[];
    }
  }

  const recentReviews = reviewsArray.map((r: Review) => ({
    ...r,
    id: r.reviewId || r.id,
  }));

  if (statsRes.error) {
    return (
      <div className="p-8 text-center bg-red-50 text-red-600 rounded-2xl border border-red-100">
        <h2 className="text-xl font-bold mb-2">Error loading dashboard</h2>
        <p>{statsRes.error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight transition-all">
            Welcome back,{" "}
            <span className="text-blue-600 font-extrabold">
              {session?.user.name}
            </span>
            ! 👋
          </h1>
          <p className="text-gray-500 mt-1 font-medium italic">
            Ready to continue your learning journey today?
          </p>
        </div>
        <Link
          href="/tutors"
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 active:scale-95"
        >
          Book a New Session <Calendar className="w-5 h-5" />
        </Link>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatsCard
          icon={Calendar}
          label="Total Bookings"
          value={stats?.bookings?.total || 0}
          color="bg-blue-500"
          trend="All time"
        />
        <StatsCard
          icon={CheckCircle2}
          label="Completed"
          value={stats?.bookings?.completed || 0}
          color="bg-green-500"
          trend="Successful sessions"
        />
        <StatsCard
          icon={Clock}
          label="Pending Sessions"
          value={stats?.bookings?.pending || 0}
          color="bg-orange-500"
          trend="Scheduled ahead"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Bookings */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800">Recent Bookings</h2>
            <Link
              href="/student/bookings"
              className="text-blue-600 font-semibold hover:underline flex items-center gap-1 text-sm"
            >
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="p-6">
            {recentBookings.length > 0 ? (
              <RecentBookings bookings={recentBookings} />
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-gray-300" />
                </div>
                <h3 className="text-gray-500 font-medium">No bookings yet</h3>
                <Link
                  href="/tutors"
                  className="text-blue-600 font-bold hover:underline mt-2 inline-block"
                >
                  Find a tutor now
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          {/* Quick Profile */}
          <div className="bg-linear-to-br from-blue-600 to-blue-700 p-6 rounded-2xl text-white shadow-xl shadow-blue-200">
            <div className="flex items-center gap-4 mb-6">
              <Award className="w-8 h-8 text-blue-200" />
              <h2 className="text-xl font-bold">Your Status</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                <span className="text-blue-100">Level</span>
                <span className="font-bold">Learner</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                <span className="text-blue-100">Active Since</span>
                <span className="font-bold">
                  {new Date(session?.user.createdAt || "").getFullYear()}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-500" /> Goals
            </h2>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-sm text-gray-600 font-medium">
                <div className="w-2 h-2 rounded-full bg-blue-500" /> Complete 3
                more sessions
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-600 font-medium">
                <div className="w-2 h-2 rounded-full bg-green-500" /> Leave a
                review for your last tutor
              </li>
            </ul>
          </div>

          {/* Recent Reviews Sidebar Block */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-500" /> My Recent Reviews
              </h2>
              <Link
                href="/student/reviews"
                className="text-xs font-bold text-blue-600 hover:underline"
              >
                See all
              </Link>
            </div>

            <div className="space-y-4">
              {recentReviews.length > 0 ? (
                recentReviews.map((review: Review) => (
                  <div key={review.id} className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`w-3 h-3 ${s <= review.rating ? "fill-amber-400 text-amber-400" : "text-gray-200"}`}
                          />
                        ))}
                      </div>
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">
                        {review.tutor?.user?.name?.split(" ")[0]}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 font-medium italic line-clamp-2">
                      &ldquo;{review.comment}&rdquo;
                    </p>
                    <div className="h-px bg-gray-50 w-full" />
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-400 font-medium italic">
                  No reviews shared yet.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface StatsCardProps {
  icon: React.ElementType;
  label: string;
  value: number;
  color: string;
  trend: string;
}

function StatsCard({ icon: Icon, label, value, color, trend }: StatsCardProps) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-6 group hover:shadow-md transition-shadow">
      <div
        className={`w-14 h-14 ${color} rounded-2xl flex items-center justify-center text-white shadow-lg shadow-opacity-20 group-hover:scale-110 transition-transform`}
      >
        <Icon className="w-7 h-7" />
      </div>
      <div>
        <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">
          {label}
        </p>
        <h3 className="text-3xl font-black text-gray-800">{value}</h3>
        <p className="text-xs text-gray-400 mt-1 font-semibold">{trend}</p>
      </div>
    </div>
  );
}
