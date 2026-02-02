"use client";

import { cancelBookingAction } from "@/actions/student.actions";
import {
  Calendar,
  Clock,
  MapPin,
  MessageSquare,
  Users,
  XCircle,
} from "lucide-react";
import Image from "next/image";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import ReviewForm from "./ReviewForm";

interface Booking {
  id: string;
  status: string;
  date: string;
  time: string;
  duration: number;
  review?: { rating: number } | null;
  tutor?: {
    subjects?: string[];
    address?: string;
    user?: {
      name: string;
      image?: string | null;
    };
  };
}

export default function BookingList({ bookings }: { bookings: Booking[] }) {
  const [isPending, startTransition] = useTransition();
  const [reviewingBookingId, setReviewingBookingId] = useState<string | null>(
    null,
  );

  const handleCancel = async (id: string) => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;

    startTransition(async () => {
      const res = await cancelBookingAction(id);
      if (res?.error) {
        toast.error(res.error || "Failed to cancel booking");
      } else {
        toast.success("Booking cancelled successfully");
      }
    });
  };

  const bookingBeingReviewed = bookings.find(
    (b) => b.id === reviewingBookingId,
  );

  if (bookings.length === 0) {
    return (
      <div className="p-20 text-center">
        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <Calendar className="w-10 h-10 text-gray-300" />
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">
          No bookings found
        </h2>
        <p className="text-gray-500 font-medium mb-6 max-w-xs mx-auto text-balance">
          Looks like you haven&apos;t booked any sessions with this filter yet.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Review Modal */}
      {reviewingBookingId && bookingBeingReviewed && (
        <ReviewForm
          bookingId={reviewingBookingId}
          tutorName={bookingBeingReviewed.tutor?.user?.name || "Tutor"}
          onClose={() => setReviewingBookingId(null)}
        />
      )}

      <div className="divide-y divide-gray-100">
        {bookings.map((booking) => (
          <div
            key={booking.id}
            className={`p-6 hover:bg-gray-50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-6 group ${isPending ? "opacity-50" : ""}`}
          >
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl shrink-0 flex items-center justify-center overflow-hidden border-2 border-white shadow-sm relative">
                {booking.tutor?.user?.image ? (
                  <Image
                    src={booking.tutor.user.image}
                    alt=""
                    fill
                    className="object-cover"
                  />
                ) : (
                  <Users className="w-8 h-8 text-blue-600" />
                )}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-lg text-gray-800 tracking-tight">
                    {booking.tutor?.user?.name || "Tutor"}
                  </h3>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-tighter border ${
                      booking.status === "COMPLETED"
                        ? "bg-green-100 text-green-700 border-green-200"
                        : booking.status === "CANCELLED"
                          ? "bg-red-100 text-red-700 border-red-200"
                          : "bg-blue-100 text-blue-700 border-blue-200"
                    }`}
                  >
                    {booking.status}
                  </span>
                </div>
                <p className="text-blue-600 font-bold text-sm">
                  {booking.tutor?.subjects?.join(", ") || "Tutoring Session"}
                </p>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 font-semibold mt-2">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-gray-400" />{" "}
                    {new Date(booking.date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-gray-400" />{" "}
                    {new Date(booking.time).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}{" "}
                    ({booking.duration}h)
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-gray-400" />{" "}
                    {booking.tutor?.address || "Online"}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {booking.status === "CONFIRMED" && (
                <button
                  onClick={() => handleCancel(booking.id)}
                  disabled={isPending}
                  className="px-4 py-2 text-red-600 font-bold text-sm border-2 border-red-50 hover:bg-red-50 rounded-xl transition-all flex items-center gap-2 active:scale-95"
                >
                  <XCircle className="w-4 h-4" /> Cancel
                </button>
              )}
              {booking.status === "COMPLETED" && !booking.review && (
                <button
                  onClick={() => setReviewingBookingId(booking.id)}
                  className="px-4 py-2 bg-blue-600 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all flex items-center gap-2 active:scale-95"
                >
                  <MessageSquare className="w-4 h-4" /> Leave Review
                </button>
              )}
              {booking.status === "COMPLETED" && booking.review && (
                <span className="px-4 py-2 bg-green-50 text-green-700 font-bold text-sm rounded-xl flex items-center gap-2">
                  ✓ Reviewed
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
