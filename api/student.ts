import {
  Booking,
  PaginatedResponse,
  Review,
  StudentProfile,
  StudentStats,
  Tutor,
} from "@/lib/types";
import { apiFetch } from "./client";

export const studentApi = {
  // Public
  browseTutors: (query: {
    search?: string;
    categoryId?: string;
    page?: number;
    limit?: number;
    onlyFeatured?: boolean;
    onlyAvailable?: boolean;
  }, options?: RequestInit) => {
    const params = new URLSearchParams();
    if (query.search) params.set("search", query.search);
    if (query.categoryId) params.set("categoryId", query.categoryId);
    if (query.page) params.set("page", query.page.toString());
    if (query.limit) params.set("limit", query.limit.toString());
    if (query.onlyFeatured) params.set("onlyFeatured", "true");
    if (query.onlyAvailable) params.set("onlyAvailable", "true");

    const queryString = params.toString();
    return apiFetch<PaginatedResponse<Tutor>>(
      `/student/tutors${queryString ? `?${queryString}` : ""}`,
      options,
    );
  },
  getTutorDetails: (id: string, options?: RequestInit) => apiFetch<Tutor>(`/student/tutors/${id}`, options),
  listCategories: (options?: RequestInit) =>
    apiFetch<{ categoryId: string; name: string; subjects: string[] }[]>(
      "/student/categories",
      options,
    ),

  // Private (requires auth)
  getProfile: (options?: RequestInit) =>
    apiFetch<{ profile: StudentProfile }>("/student/me", options),
  upsertProfile: (data: Partial<StudentProfile>, options?: RequestInit) =>
    apiFetch<StudentProfile>("/student/me", {
      ...options,
      method: "PUT",
      body: JSON.stringify(data),
    }),
  updateProfile: (data: Partial<StudentProfile>, options?: RequestInit) =>
    apiFetch<StudentProfile>("/student/me", {
      ...options,
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  createBooking: (
    data: { tutorId: string; date: Date; time: Date; duration: number },
    options?: RequestInit,
  ) =>
    apiFetch<{ success: boolean }>("/student/bookings", {
      ...options,
      method: "POST",
      body: JSON.stringify(data),
    }),
  listBookings: (
    query: { status?: string; page?: number; limit?: number },
    options?: RequestInit,
  ) => {
    const params = new URLSearchParams();
    if (query.status) params.set("status", query.status);
    if (query.page) params.set("page", query.page.toString());
    if (query.limit) params.set("limit", query.limit.toString());

    const queryString = params.toString();
    return apiFetch<PaginatedResponse<Booking>>(
      `/student/bookings${queryString ? `?${queryString}` : ""}`,
      options,
    );
  },
  getBookingDetails: (id: string, options?: RequestInit) =>
    apiFetch<Booking>(`/student/bookings/${id}`, options),
  cancelBooking: (id: string, options?: RequestInit) =>
    apiFetch<{ success: boolean }>(`/student/bookings/${id}/cancel`, {
      ...options,
      method: "PATCH",
    }),
  createReview: (
    data: { bookingId: string; rating: number; comment?: string },
    options?: RequestInit,
  ) =>
    apiFetch<{ success: boolean }>("/student/reviews", {
      ...options,
      method: "POST",
      body: JSON.stringify(data),
    }),
  listReviews: (
    query: { page?: number; limit?: number },
    options?: RequestInit,
  ) => {
    const params = new URLSearchParams();
    if (query.page) params.set("page", query.page.toString());
    if (query.limit) params.set("limit", query.limit.toString());
    const queryString = params.toString();
    return apiFetch<PaginatedResponse<Review>>(
      `/student/reviews${queryString ? `?${queryString}` : ""}`,
      options,
    );
  },
  getDashboardStats: (options?: RequestInit) =>
    apiFetch<StudentStats>("/student/dashboard", options),
  createCheckoutSession: (
    data: { tutorId: string; date: string; time: string; duration: number; notes?: string },
    options?: RequestInit,
  ) =>
    apiFetch<{ sessionId: string; url: string }>("/payment/create-checkout-session", {
      ...options,
      method: "POST",
      body: JSON.stringify(data),
    }),
  verifyPaymentSession: (sessionId: string, options?: RequestInit) =>
    apiFetch<{ success: boolean }>("/payment/verify-session/" + sessionId, {
      ...options,
      method: "POST",
    }),
};
