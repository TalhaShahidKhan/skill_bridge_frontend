"use client";

import { MessageSquare, Users } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import ReviewForm from "./ReviewForm";

interface Booking {
  id: string;
  status: string;
  date: string;
  time: string;
  review?: { rating: number } | null;
  tutor?: {
    subjects?: string[];
    user?: {
      name: string;
      image?: string | null;
    };
  };
}

export default function RecentBookings({ bookings }: { bookings: Booking[] }) {
  const [reviewingBookingId, setReviewingBookingId] = useState<string | null>(
    null,
  );

  const bookingBeingReviewed = bookings.find(
    (b) => b.id === reviewingBookingId,
  );

  return (
    <>
      {reviewingBookingId && bookingBeingReviewed && (
        <ReviewForm
          bookingId={reviewingBookingId}
          tutorName={bookingBeingReviewed.tutor?.user?.name || "Tutor"}
          onClose={() => setReviewingBookingId(null)}
        />
      )}

      <div className="space-y-4">
        {bookings.map((booking) => (
          <div
            key={booking.id}
            className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100 group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 relative overflow-hidden border border-white shadow-sm shrink-0">
                {booking.tutor?.user?.image ? (
                  <Image
                    src={booking.tutor.user.image}
                    alt=""
                    fill
                    className="object-cover"
                  />
                ) : (
                  <Users className="w-6 h-6" />
                )}
              </div>
              <div>
                <h3 className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                  {booking.tutor?.user?.name || "Tutor"}
                </h3>
                <p className="text-sm text-slate-400 font-semibold">
                  {new Date(booking.date).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                  })}{" "}
                  •{" "}
                  {new Date(booking.time).toLocaleTimeString(undefined, {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 mt-4 sm:mt-0">
              {booking.status === "COMPLETED" && !booking.review && (
                <button
                  onClick={() => setReviewingBookingId(booking.id)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 text-amber-600 rounded-lg text-xs font-black uppercase tracking-wider hover:bg-amber-100 transition-colors border border-amber-100"
                >
                  <MessageSquare className="w-3.5 h-3.5" /> Review Needed
                </button>
              )}

              <span
                className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border ${
                  booking.status === "COMPLETED"
                    ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                    : booking.status === "CANCELLED"
                      ? "bg-rose-50 text-rose-600 border-rose-100"
                      : "bg-blue-50 text-blue-600 border-blue-100"
                }`}
              >
                {booking.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
