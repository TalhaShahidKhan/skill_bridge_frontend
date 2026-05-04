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
  }) => {
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
    );
  },
  getTutorDetails: (id: string) => apiFetch<Tutor>(`/student/tutors/${id}`),
  listCategories: (headers?: HeadersInit) =>
    apiFetch<{ categoryId: string; name: string; subjects: string[] }[]>(
      "/student/categories",
      { headers },
    ),

  // Private (requires auth)
  getProfile: (headers?: HeadersInit) =>
    apiFetch<{ profile: StudentProfile }>("/student/me", { headers }),
  upsertProfile: (data: Partial<StudentProfile>, headers?: HeadersInit) =>
    apiFetch<StudentProfile>("/student/me", {
      method: "PUT",
      body: JSON.stringify(data),
      headers,
    }),
  updateProfile: (data: Partial<StudentProfile>, headers?: HeadersInit) =>
    apiFetch<StudentProfile>("/student/me", {
      method: "PATCH",
      body: JSON.stringify(data),
      headers,
    }),
  createBooking: (
    data: { tutorId: string; date: Date; time: Date; duration: number },
    headers?: HeadersInit,
  ) =>
    apiFetch<{ success: boolean }>("/student/bookings", {
      method: "POST",
      body: JSON.stringify(data),
      headers,
    }),
  listBookings: (
    query: { status?: string; page?: number; limit?: number },
    headers?: HeadersInit,
  ) => {
    const params = new URLSearchParams();
    if (query.status) params.set("status", query.status);
    if (query.page) params.set("page", query.page.toString());
    if (query.limit) params.set("limit", query.limit.toString());

    const queryString = params.toString();
    return apiFetch<PaginatedResponse<Booking>>(
      `/student/bookings${queryString ? `?${queryString}` : ""}`,
      { headers },
    );
  },
  getBookingDetails: (id: string, headers?: HeadersInit) =>
    apiFetch<Booking>(`/student/bookings/${id}`, { headers }),
  cancelBooking: (id: string, headers?: HeadersInit) =>
    apiFetch<{ success: boolean }>(`/student/bookings/${id}/cancel`, {
      method: "PATCH",
      headers,
    }),
  createReview: (
    data: { bookingId: string; rating: number; comment?: string },
    headers?: HeadersInit,
  ) =>
    apiFetch<{ success: boolean }>("/student/reviews", {
      method: "POST",
      body: JSON.stringify(data),
      headers,
    }),
  listReviews: (
    query: { page?: number; limit?: number },
    headers?: HeadersInit,
  ) => {
    const params = new URLSearchParams();
    if (query.page) params.set("page", query.page.toString());
    if (query.limit) params.set("limit", query.limit.toString());
    const queryString = params.toString();
    return apiFetch<PaginatedResponse<Review>>(
      `/student/reviews${queryString ? `?${queryString}` : ""}`,
      {
        headers,
      },
    );
  },
  getDashboardStats: (headers?: HeadersInit) =>
    apiFetch<StudentStats>("/student/dashboard", { headers }),
  createCheckoutSession: (
    data: { tutorId: string; date: string; time: string; duration: number; notes?: string },
    headers?: HeadersInit,
  ) =>
    apiFetch<{ sessionId: string; url: string }>("/payment/create-checkout-session", {
      method: "POST",
      body: JSON.stringify(data),
      headers,
    }),
};
