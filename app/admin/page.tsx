import { adminApi } from "@/api/admin";
import AdminDashboardClient from "@/components/admin/AdminDashboardClient";
import { Analytics } from "@/lib/types";
import { BookOpen, TrendingUp, UserCheck, Users } from "lucide-react";
import { headers } from "next/headers";

export default async function AdminDashboardPage() {
  const h = await headers();
  const { data: stats, error } = await adminApi.getAnalytics({
    cookie: h.get("cookie") || "",
  });

  if (error || !stats) {
    console.log(error);

    return (
      <div className="flex flex-col items-center justify-center h-[50vh] space-y-4">
        <p className="text-red-500 font-bold text-xl">
          Error loading analytics
        </p>
        <p className="text-slate-500">{error || "Something went wrong"}</p>
      </div>
    );
  }

  const typedStats = stats as unknown as Analytics;

  const completedBookings =
    typedStats.bookings.byStatus.find((b) => b.status === "COMPLETED")?.count ||
    0;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight font-outfit">
          Dashboard Overview
        </h1>
        <p className="text-slate-500 font-medium">
          Welcome back, Admin. Here&apos;s what&apos;s happening today.
        </p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          label="Total Users"
          value={typedStats.totals.users}
          icon={Users}
          color="bg-blue-500"
          subtext={`${typedStats.totals.students} Students, ${typedStats.totals.tutors} Tutors`}
        />
        <StatsCard
          label="Total Bookings"
          value={typedStats.totals.bookings}
          icon={BookOpen}
          color="bg-purple-500"
          subtext={`${completedBookings} Completed`}
        />
        <StatsCard
          label="Active Tutors"
          value={typedStats.totals.tutors}
          icon={UserCheck}
          color="bg-emerald-500"
          subtext="Verified Experts"
        />
        <StatsCard
          label="Avg Rating"
          value={typedStats.reviews.averageRating.toFixed(1)}
          icon={TrendingUp}
          color="bg-amber-500"
          subtext={`Based on ${typedStats.totals.reviews} reviews`}
        />
      </div>

      <AdminDashboardClient stats={typedStats} />
    </div>
  );
}

interface StatsCardProps {
  icon: React.ElementType;
  label: string;
  value: number | string;
  color: string;
  subtext: string;
}

function StatsCard({
  icon: Icon,
  label,
  value,
  color,
  subtext,
}: StatsCardProps) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">
            {label}
          </p>
          <h3 className="text-3xl font-black text-slate-900 mt-1">{value}</h3>
        </div>
        <div
          className={`p-3 rounded-xl ${color} shadow-lg shadow-black/10 text-white`}
        >
          <Icon className="w-6 h-6" />
        </div>
      </div>
      <p className="text-xs font-semibold text-slate-500 flex items-center gap-1">
        {subtext}
      </p>
    </div>
  );
}
