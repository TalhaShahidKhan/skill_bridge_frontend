"use client";

import { tutorApi } from "@/api/tutor";
import { PaginatedResponse, Review } from "@/lib/types";
import { Award, Calendar, MessageSquare, Star, User } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export default function TutorReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = useCallback(async () => {
    try {
      const response = await tutorApi.listReviews({});
      const reviewsRaw = response.data;
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

      setReviews(
        reviewsArray.map((r) => ({
          ...r,
          id: r.reviewId || r.id,
        })),
      );
    } catch (err) {
      console.error("Failed to fetch reviews:", err);
      toast.error("Could not load reviews");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
          Student Feedback
        </h1>
        <p className="text-gray-500 font-medium">
          Reviews and ratings from your students.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-32 bg-gray-50 rounded-2xl animate-pulse border border-gray-100"
                />
              ))}
            </div>
          ) : reviews.length > 0 ? (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 border border-indigo-100 relative overflow-hidden shrink-0">
                        {review.student?.user?.image ? (
                          <Image
                            src={review.student.user.image}
                            alt=""
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <User className="w-6 h-6" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-800 tracking-tight">
                          {review.student?.user?.name || "Student"}
                        </h3>
                        <div className="flex items-center gap-1.5 text-xs text-gray-400 font-bold uppercase tracking-widest mt-0.5">
                          <Calendar className="w-3.5 h-3.5" /> Reviewed on{" "}
                          {new Date(review.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-5 h-5 ${star <= review.rating ? "fill-amber-400 text-amber-400" : "text-gray-200"}`}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl relative">
                    <MessageSquare className="w-4 h-4 text-gray-300 absolute -top-2 -left-2 bg-white rounded-full p-0.5 border border-gray-100 scale-125" />
                    <p className="text-gray-700 italic font-medium leading-relaxed">
                      &ldquo;{review.comment}&rdquo;
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white p-20 rounded-2xl border border-dashed border-gray-200 text-center">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Star className="w-10 h-10 text-gray-200" />
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-2 font-outfit">
                No reviews yet
              </h2>
              <p className="text-gray-500 font-medium max-w-xs mx-auto mb-6">
                Complete more sessions to receive feedback from your students.
              </p>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-linear-to-br from-amber-400 to-orange-500 p-8 rounded-2xl text-white shadow-xl shadow-amber-100 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-150 transition-transform duration-700">
              <Award className="w-32 h-32" />
            </div>
            <Star className="w-10 h-10 text-amber-100 mb-4" />
            <h3 className="text-2xl font-black mb-1">Expert Rating</h3>
            <p className="text-sm text-amber-50 font-semibold mb-6">
              Your rating reflects your teaching quality.
            </p>
            <div className="text-5xl font-black text-white">
              {reviews.length > 0
                ? (
                    reviews.reduce((acc, r) => acc + r.rating, 0) /
                    reviews.length
                  ).toFixed(1)
                : "0.0"}
            </div>
            <div className="text-xs text-amber-100 font-bold uppercase tracking-widest mt-1">
              Average Rating
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-800 mb-4 font-outfit">
              Tips for Ratings
            </h3>
            <ul className="space-y-3 text-sm text-gray-500 font-semibold text-pretty">
              <li className="flex gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />{" "}
                Be punctual for every session
              </li>
              <li className="flex gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />{" "}
                Share pre-session materials
              </li>
              <li className="flex gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />{" "}
                Ask for feedback at the end
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
