"use client";

import { adminApi } from "@/api/admin";
import { Calendar, Clock, Loader2, Search, Trash2 } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Pagination } from "./Pagination";

interface Booking {
  bookingId: string;
  date: string;
  time: string;
  duration: number;
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
  meetLink?: string;
  student: {
    user: {
      name: string;
      email: string;
      image: string | null;
    };
  };
  tutor: {
    user: {
      name: string;
      email: string;
    };
    subject: string;
  };
}

interface BookingsResponse {
  data: Booking[];
  pagination: {
    page: number;
    totalPages: number;
    total: number;
    limit: number;
  };
}

export default function AdminBookingsClient() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [pagination, setPagination] = useState<BookingsResponse["pagination"] | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1");

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await adminApi.listBookings({
        page: page,
        limit: 10,
        ...(statusFilter !== "All" ? { status: statusFilter } : {}),
        ...(search ? { search } : {}),
      });

      if (error) {
        toast.error(error);
        return;
      }

      if (data) {
        const result = data as unknown as BookingsResponse;
        setBookings(result.data || []);
        setPagination(result.pagination);
      }
    } catch {
      toast.error("Failed to fetch bookings");
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, search]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchBookings();
    }, 500);
    return () => clearTimeout(timer);
  }, [fetchBookings]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this booking?")) return;
    try {
      const { error } = await adminApi.deleteBooking(id);
      if (error) {
        toast.error(error);
      } else {
        toast.success("Booking deleted successfully");
        fetchBookings();
      }
    } catch {
      toast.error("Failed to delete booking");
    }
  };

  const getStatusColor = (status: Booking["status"]) => {
    switch (status) {
      case "CONFIRMED":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "COMPLETED":
        return "bg-green-100 text-green-700 border-green-200";
      case "CANCELLED":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-amber-100 text-amber-700 border-amber-200";
    }
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight font-outfit">
          Booking Management
        </h1>
        <p className="text-slate-500 font-medium">
          Monitor all session bookings across the platform.
        </p>
      </header>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
            {["All", "PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"].map(
              (s) => (
                <button
                  key={s}
                  onClick={() => {
                    setStatusFilter(s);
                    const params = new URLSearchParams(searchParams);
                    params.set("page", "1");
                    router.push(`?${params.toString()}`);
                  }}
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap border ${
                    statusFilter === s
                      ? "bg-slate-900 text-white border-slate-900"
                      : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  {s.charAt(0) + s.slice(1).toLowerCase()}
                </button>
              ),
            )}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all font-medium text-slate-700"
            />
          </div>
        </div>

        {/* Bookings List */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 font-bold text-slate-500 text-xs uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-4 font-bold text-slate-500 text-xs uppercase tracking-wider">
                  Tutor
                </th>
                <th className="px-6 py-4 font-bold text-slate-500 text-xs uppercase tracking-wider">
                  Session Info
                </th>
                <th className="px-6 py-4 font-bold text-slate-500 text-xs uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 font-bold text-slate-500 text-xs uppercase tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center">
                    <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mx-auto" />
                  </td>
                </tr>
              ) : bookings.length > 0 ? (
                bookings.map((booking) => (
                  <tr
                    key={booking.bookingId}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 overflow-hidden relative">
                          {booking.student.user.image ? (
                            <Image
                              src={booking.student.user.image}
                              alt=""
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs font-bold">
                              {booking.student.user.name.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-sm">
                            {booking.student.user.name}
                          </p>
                          <p className="text-xs text-slate-500 font-medium">
                            {booking.student.user.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-bold text-slate-900 text-sm">
                          {booking.tutor.user.name}
                        </p>
                        <p className="text-xs text-indigo-600 font-bold">
                          {booking.tutor.subject}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          {new Date(booking.date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          {new Date(booking.time).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}{" "}
                          ({booking.duration}h)
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wide border ${getStatusColor(booking.status)}`}
                      >
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(booking.bookingId)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        title="Delete Booking"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-12 text-center text-slate-500 font-medium"
                  >
                    No bookings found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination && (
          <div className="p-4 bg-slate-50/50 border-t border-slate-200">
            <Pagination pagination={pagination} />
          </div>
        )}
      </div>
    </div>
  );
}
