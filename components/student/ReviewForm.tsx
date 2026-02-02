"use client";

import { createReviewWithForm } from "@/actions/student.actions";
import { ActionState } from "@/lib/types";
import { Loader2, MessageSquare, Star, X } from "lucide-react";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";

interface ReviewFormProps {
  bookingId: string;
  tutorName: string;
  onClose: () => void;
}

export default function ReviewForm({
  bookingId,
  tutorName,
  onClose,
}: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);

  const initialState: ActionState = { success: false };
  const [state, formAction, isPending] = useActionState(
    createReviewWithForm,
    initialState,
  );

  useEffect(() => {
    if (state?.success) {
      toast.success("Review submitted successfully!");
      onClose();
    } else if (state?.error) {
      toast.error(state.error);
    }
  }, [state, onClose]);

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
      <div
        className="bg-white rounded-3xl w-full max-w-md shadow-[0_20px_50px_rgba(0,0,0,0.2)] overflow-hidden animate-in zoom-in-95 duration-200 border border-white/20"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Gradient Background */}
        <div className="bg-linear-to-r from-blue-600 to-indigo-700 p-8 text-white relative h-32 flex flex-col justify-end">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors text-white"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 bg-blue-500/30 rounded-xl backdrop-blur-md">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-black tracking-tight">
              Rate your Session
            </h2>
          </div>
          <p className="text-blue-100 text-sm font-medium">
            How was your experience with {tutorName}?
          </p>
        </div>

        <div className="p-8 space-y-8">
          <form action={formAction} className="space-y-8">
            <input type="hidden" name="bookingId" value={bookingId} />
            <input type="hidden" name="rating" value={rating} />

            {/* Star Rating Section */}
            <div className="space-y-4 text-center">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest block">
                Your Rating
              </label>
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="group relative p-1 transition-all active:scale-90"
                  >
                    <Star
                      className={`w-10 h-10 transition-all duration-300 ${
                        star <= (hoveredRating || rating)
                          ? "fill-amber-400 text-amber-400 scale-110 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]"
                          : "text-slate-200 group-hover:text-slate-300"
                      }`}
                    />
                    {star <= rating && (
                      <span className="absolute inset-0 animate-ping bg-amber-400/20 rounded-full -z-10" />
                    )}
                  </button>
                ))}
              </div>
              <div className="h-4">
                {rating > 0 && (
                  <p className="text-sm font-bold text-amber-600 animate-in slide-in-from-top-2 duration-300">
                    {rating === 5
                      ? "Exceptional! 🌟"
                      : rating === 4
                        ? "Great Experience! ✨"
                        : rating === 3
                          ? "It was okay 👍"
                          : rating === 2
                            ? "Could be better 😕"
                            : "Poor 😞"}
                  </p>
                )}
              </div>
            </div>

            {/* Comment Section */}
            <div className="space-y-3">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <MessageSquare className="w-3.5 h-3.5" /> Share your feedback
              </label>
              <textarea
                name="comment"
                rows={4}
                required
                placeholder="What did you learn? How was the tutor's methodology?"
                className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white outline-none transition-all resize-none font-medium text-slate-700 placeholder:text-slate-400"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-2">
              <button
                type="button"
                onClick={onClose}
                disabled={isPending}
                className="flex-1 px-6 py-4 border-2 border-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-50 transition-all disabled:opacity-50 active:scale-95"
              >
                Skip
              </button>
              <button
                type="submit"
                disabled={isPending || rating === 0}
                className="flex-3 px-6 py-4 bg-linear-to-r from-blue-600 to-indigo-600 text-white font-black rounded-2xl shadow-xl shadow-blue-200 hover:shadow-2xl hover:shadow-blue-300 transition-all disabled:opacity-50 active:scale-95 flex items-center justify-center gap-2"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" /> Submitting...
                  </>
                ) : (
                  "Post Review"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
