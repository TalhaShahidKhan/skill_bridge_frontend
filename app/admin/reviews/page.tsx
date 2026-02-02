"use client";

import { authClient } from "@/api/betterAuth";
import { Loader2, Star, Trash2 } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

interface Review {
  reviewId: string;
  rating: number;
  comment: string;
  createdAt: string;
  student: {
    user: {
      name: string;
      image: string | null;
    };
  };
  tutor: {
    user: {
      name: string;
    };
    subject: string;
  };
}

interface ReviewsResponse {
  data: Review[];
  meta: {
    totalPages: number;
  };
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    try {
      const response = await authClient.$fetch("/api/admin/reviews", {
        method: "GET",
        query: {
          page: page,
          limit: 10,
        },
      });

      if (response.data) {
        const result = response.data as unknown as ReviewsResponse;
        setReviews(result.data || []);
        setTotalPages(result.meta?.totalPages || 1);
      }
    } catch {
      toast.error("Failed to fetch reviews");
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleDelete = async (reviewId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this review? This action cannot be undone.",
      )
    )
      return;

    try {
      const { error } = await authClient.$fetch(
        `/api/admin/reviews/${reviewId}`,
        {
          method: "DELETE",
        },
      );

      if (error) {
        toast.error(error.message || "Failed to delete review");
        return;
      }

      toast.success("Review deleted successfully");
      fetchReviews();
    } catch {
      toast.error("An unexpected error occurred");
    }
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight font-outfit">
          Review Moderation
        </h1>
        <p className="text-slate-500 font-medium">
          Oversee feedback and maintain community standards.
        </p>
      </header>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-200 flex justify-end">
          {/* Could add filters here later */}
        </div>

        {/* Reviews List */}
        <div className="divide-y divide-slate-100">
          {loading ? (
            <div className="py-20 flex justify-center">
              <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
            </div>
          ) : reviews.length > 0 ? (
            reviews.map((review) => (
              <div
                key={review.reviewId}
                className="p-6 hover:bg-slate-50/50 transition-colors group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-100 overflow-hidden relative border border-slate-200 shrink-0">
                      {review.student.user.image ? (
                        <Image
                          src={review.student.user.image}
                          alt=""
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold">
                          {review.student.user.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-bold text-slate-900">
                          {review.student.user.name}
                        </p>
                        <span className="text-slate-400 text-xs font-semibold">
                          •
                        </span>
                        <p className="text-sm text-slate-500 font-medium">
                          Reviewed{" "}
                          <span className="text-indigo-600 font-bold">
                            {review.tutor.user.name}
                          </span>{" "}
                          ({review.tutor.subject})
                        </p>
                      </div>
                      <div className="flex items-center gap-0.5 mb-2">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`w-3.5 h-3.5 ${s <= review.rating ? "fill-amber-400 text-amber-400" : "text-slate-200"}`}
                          />
                        ))}
                      </div>
                      <div className="relative pl-4 border-l-2 border-slate-200">
                        <p className="text-slate-700 italic font-medium">
                          &quot;{review.comment}&quot;
                        </p>
                      </div>
                      <p className="text-xs text-slate-400 font-bold mt-3 uppercase tracking-wider">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDelete(review.reviewId)}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                    title="Delete Review"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="py-20 text-center text-slate-500 font-medium">
              No reviews found.
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-slate-200 flex items-center justify-between">
          <span className="text-sm text-slate-500 font-medium">
            Page {page} of {totalPages}
          </span>
          <div className="flex gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-4 py-2 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Previous
            </button>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="px-4 py-2 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
