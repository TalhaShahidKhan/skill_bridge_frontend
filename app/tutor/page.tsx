import { authClient } from "@/api/betterAuth";
import { tutorApi } from "@/api/tutor";
import { Booking, PaginatedResponse, Review } from "@/lib/types";
import {
  ArrowRight,
  Award,
  Calendar,
  CheckCircle2,
  Clock,
  DollarSign,
  Star,
  Users,
} from "lucide-react";
import { Metadata } from "next";
import { headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Tutor Dashboard | Skill Bridge",
  description: "Manage your teaching schedule, student sessions, and reviews.",
};

interface DashboardStats {
  sessions: {
    total: number;
    confirmed: number;
    completed: number;
    cancelled: number;
  };
  reviews: {
    averageRating: number;
    count: number;
  };
  earnings: {
    amount: number;
    currency: string;
  };
}

export default async function TutorDashboardPage() {
  const h = await headers();
  const cookie = h.get("cookie") || "";

  const [sessionRes, statsRes, sessionsRes, reviewsRes] = await Promise.all([
    authClient.getSession({ fetchOptions: { headers: { cookie } } }),
    tutorApi.getDashboardStats({ cookie }),
    tutorApi.listSessions({ limit: 5 }, { cookie }),
    tutorApi.listReviews({ limit: 3 }, { cookie }),
  ]);

  const session = sessionRes.data;
  const stats = statsRes.data as unknown as DashboardStats;
  const sessionsData = sessionsRes.data as PaginatedResponse<Booking>;

  const recentSessions = (sessionsData?.data || []).map((s: Booking) => ({
    ...s,
    id: s.bookingId || s.id,
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
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Tutor Dashboard,{" "}
            <span className="text-indigo-600 font-extrabold">
              {session?.user.name}
            </span>
            ! 📚
          </h1>
          <p className="text-gray-500 mt-1 font-medium italic">
            You have {stats?.sessions.confirmed || 0} upcoming sessions today.
          </p>
        </div>
        <div className="flex gap-4">
          <Link
            href="/tutor/profile"
            className="px-6 py-3 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-all active:scale-95"
          >
            Edit Profile
          </Link>
          <Link
            href="/tutor/availability"
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 active:scale-95"
          >
            Availability <Clock className="w-5 h-5" />
          </Link>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          icon={Calendar}
          label="Total Sessions"
          value={stats?.sessions.total || 0}
          color="bg-indigo-500"
          trend="All time"
        />
        <StatsCard
          icon={CheckCircle2}
          label="Completed"
          value={stats?.sessions.completed || 0}
          color="bg-emerald-500"
          trend="Successful sessions"
        />
        <StatsCard
          icon={Star}
          label="Rating"
          value={stats?.reviews.averageRating?.toFixed(1) || "0.0"}
          color="bg-amber-500"
          trend={`${stats?.reviews.count || 0} reviews`}
        />
        <StatsCard
          icon={DollarSign}
          label="Earnings"
          value={`${stats?.earnings.amount.toLocaleString()} ${stats?.earnings.currency || "BDT"}`}
          color="bg-blue-500"
          trend="Based on completed sessions"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Sessions */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800">
              Upcoming & Recent Sessions
            </h2>
            <Link
              href="/tutor/bookings"
              className="text-indigo-600 font-semibold hover:underline flex items-center gap-1 text-sm"
            >
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="p-6">
            {recentSessions.length > 0 ? (
              <div className="space-y-4">
                {recentSessions.map((session) => (
                  <div
                    key={session.id}
                    className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 relative overflow-hidden">
                        {session.student?.user?.image ? (
                          <Image
                            src={session.student.user.image}
                            alt=""
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <Users className="w-6 h-6" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-800">
                          {session.student?.user?.name || "Student"}
                        </h3>
                        <p className="text-sm text-gray-500 font-medium">
                          {new Date(session.date).toLocaleDateString(
                            undefined,
                            { month: "short", day: "numeric" },
                          )}{" "}
                          at{" "}
                          {new Date(session.time).toLocaleTimeString(
                            undefined,
                            { hour: "2-digit", minute: "2-digit" },
                          )}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                        session.status === "COMPLETED"
                          ? "bg-emerald-100 text-emerald-700"
                          : session.status === "CANCELLED"
                            ? "bg-rose-100 text-rose-700"
                            : "bg-indigo-100 text-indigo-700"
                      }`}
                    >
                      {session.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-gray-300" />
                </div>
                <h3 className="text-gray-500 font-medium">
                  No sessions scheduled yet
                </h3>
                <p className="text-sm text-gray-400 mt-1">
                  Make sure your profile is complete to attract students.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          {/* Quick Profile */}
          <div className="bg-linear-to-br from-indigo-600 to-indigo-700 p-6 rounded-2xl text-white shadow-xl shadow-indigo-200">
            <div className="flex items-center gap-4 mb-6">
              <Award className="w-8 h-8 text-indigo-200" />
              <h2 className="text-xl font-bold">Performance</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                <span className="text-indigo-100">Completion Rate</span>
                <span className="font-bold">
                  {stats?.sessions.total
                    ? Math.round(
                        (stats.sessions.completed /
                          (stats.sessions.total - stats.sessions.cancelled ||
                            1)) *
                          100,
                      )
                    : 0}
                  %
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                <span className="text-indigo-100">Total Reviews</span>
                <span className="font-bold">{stats?.reviews.count || 0}</span>
              </div>
            </div>
          </div>

          {/* Recent Reviews Sidebar Block */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-500" /> Recent Reviews
              </h2>
              <Link
                href="/tutor/reviews"
                className="text-xs font-bold text-indigo-600 hover:underline"
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
                        {review.student?.user?.name?.split(" ")[0]}
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
                  No reviews yet.
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
  value: string | number;
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
