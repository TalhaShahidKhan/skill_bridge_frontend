"use client";

import { Analytics } from "@/lib/types";
import { BarChart3, Calendar } from "lucide-react";
import {
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function AdminDashboardClient({ stats }: { stats: Analytics }) {
  const confirmedBookings =
    stats.bookings.byStatus.find((b) => b.status === "CONFIRMED")?.count || 0;
  const completedBookings =
    stats.bookings.byStatus.find((b) => b.status === "COMPLETED")?.count || 0;
  const cancelledBookings =
    stats.bookings.byStatus.find((b) => b.status === "CANCELLED")?.count || 0;

  const statusPieData = [
    { name: "Confirmed", value: confirmedBookings, color: "#3B82F6" },
    { name: "Completed", value: completedBookings, color: "#10B981" },
    { name: "Cancelled", value: cancelledBookings, color: "#EF4444" },
  ];

  const lineChartData = stats.bookings.perDay.map((d) => ({
    name: new Date(d.day).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    }),
    bookings: d.count,
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Booking Trend Card */}
      <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-indigo-600" />
          Booking Trends (Last 30 Days)
        </h3>
        <div className="h-[300px] w-full">
          {lineChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineChartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94a3b8", fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94a3b8", fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    borderRadius: "12px",
                    border: "none",
                    boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="bookings"
                  stroke="#4F46E5"
                  strokeWidth={4}
                  dot={{
                    r: 4,
                    fill: "#4F46E5",
                    strokeWidth: 2,
                    stroke: "#fff",
                  }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-slate-400 font-medium italic">
              No booking data available yet
            </div>
          )}
        </div>
      </div>

      {/* Booking Status Pie Chart */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-indigo-600" />
          Booking Status
        </h3>
        <div className="h-[250px] w-full flex items-center justify-center">
          {stats.totals.bookings > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    borderRadius: "12px",
                    border: "none",
                    boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-slate-400 font-medium italic">
              No bookings found
            </div>
          )}
        </div>
        <div className="mt-4 space-y-2">
          {statusPieData.map((item) => (
            <div key={item.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm font-semibold text-slate-600">
                  {item.name}
                </span>
              </div>
              <span className="text-sm font-bold text-slate-900">
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
