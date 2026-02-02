"use client";

import { studentApi } from "@/api/student";
import { PaginatedResponse, Review } from "@/lib/types";
import { Award, Calendar, MessageSquare, Star, User } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export default function StudentReviewsClient() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isPending, setIsPending] = useState(true);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });

  const fetchReviews = useCallback(async (page: number) => {
    setIsPending(true);
    try {
      const res = await studentApi.listReviews({ page, limit: 10 });
      if (res.error) {
        toast.error(res.error);
        return;
      }

      const reviewsRaw = res.data;
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

      setReviews(reviewsArray);
      if ("pagination" in res && res.pagination) {
        setPagination(res.pagination as typeof pagination);
      }
    } catch {
      toast.error("Failed to fetch reviews");
    } finally {
      setIsPending(false);
    }
  }, []);

  useEffect(() => {
    fetchReviews(1);
  }, [fetchReviews]);

  if (isPending && reviews.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 text-amber-600 rounded-full border border-amber-100 italic text-sm font-semibold">
            <Star className="w-4 h-4 fill-amber-600" />
            My Feedback History
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight font-outfit">
            My <span className="text-blue-600">Reviews</span>
          </h1>
          <p className="text-slate-500 font-medium">
            You have shared {pagination.total} reviews with our tutor community.
          </p>
        </div>
      </div>

      {reviews.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-slate-100 space-y-4">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
            <MessageSquare className="w-10 h-10 text-slate-300" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">No reviews yet</h3>
          <p className="text-slate-500 max-w-sm mx-auto">
            Complete a tutoring session to share your feedback and help others
            find the best tutors.
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {reviews.map((review) => (
            <div
              key={review.reviewId || review.id}
              className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-blue-500/5 to-transparent rounded-bl-full pointer-events-none" />

              <div className="flex flex-col md:flex-row md:items-start justify-between gap-8 relative z-10">
                <div className="flex-1 space-y-6">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-5 h-5 ${
                          star <= review.rating
                            ? "fill-amber-400 text-amber-400"
                            : "text-slate-200"
                        }`}
                      />
                    ))}
                    <span className="ml-2 text-sm font-bold text-amber-600">
                      {review.rating}.0
                    </span>
                  </div>

                  <blockquote className="text-lg text-slate-700 font-medium leading-relaxed italic">
                    &quot;{review.comment}&quot;
                  </blockquote>

                  <div className="flex flex-wrap gap-4 pt-2">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 text-slate-500 rounded-xl text-xs font-bold border border-slate-100">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(review.createdAt).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-center md:items-end gap-4 shrink-0">
                  <div className="relative group/avatar">
                    <div className="w-20 h-20 bg-blue-50 rounded-2xl overflow-hidden border-2 border-white shadow-md flex items-center justify-center group-hover/avatar:scale-105 transition-transform duration-300">
                      {review.tutor?.user?.image ? (
                        <Image
                          src={review.tutor.user.image}
                          alt={review.tutor.user.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <User className="w-10 h-10 text-blue-200" />
                      )}
                    </div>
                    <div className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-1.5 rounded-lg shadow-lg">
                      <Award className="w-3 h-3" />
                    </div>
                  </div>
                  <div className="text-center md:text-right">
                    <div className="text-sm font-black text-slate-400 uppercase tracking-widest mb-1">
                      Tutored By
                    </div>
                    <div className="text-lg font-bold text-slate-900">
                      {review.tutor?.user?.name || "Expert Tutor"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {pagination.totalPages > 1 && (
        <div className="mt-12 flex justify-center gap-3">
          {[...Array(pagination.totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => fetchReviews(i + 1)}
              className={`w-12 h-12 rounded-2xl font-bold transition-all ${
                pagination.page === i + 1
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                  : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
