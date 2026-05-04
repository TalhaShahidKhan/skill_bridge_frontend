import { Booking, PaginatedResponse, Review, TutorProfile, TutorStats } from "@/lib/types";
import { apiFetch } from "./client";

export const tutorApi = {
  getProfile: (headers?: HeadersInit) =>
    apiFetch<TutorProfile>("/tutor/me", { headers }),
  upsertProfile: (data: Partial<TutorProfile>, headers?: HeadersInit) =>
    apiFetch<TutorProfile>("/tutor/me", {
      method: "PUT",
      body: JSON.stringify(data),
      headers,
    }),
  updateProfile: (data: Partial<TutorProfile>, headers?: HeadersInit) =>
    apiFetch<TutorProfile>("/tutor/me", {
      method: "PATCH",
      body: JSON.stringify(data),
      headers,
    }),
  setAvailability: (
    data: { availableFrom: string; availableTo: string; isAvailable: boolean },
    headers?: HeadersInit,
  ) =>
    apiFetch<{ success: boolean }>("/tutor/availability", {
      method: "PUT",
      body: JSON.stringify(data),
      headers,
    }),
  listSessions: (
    query: { status?: string; page?: number; limit?: number },
    headers?: HeadersInit,
  ) => {
    const params = new URLSearchParams();
    if (query.status) params.set("status", query.status);
    if (query.page) params.set("page", query.page.toString());
    if (query.limit) params.set("limit", query.limit.toString());

    const queryString = params.toString();
    return apiFetch<PaginatedResponse<Booking>>(
      `/tutor/sessions${queryString ? `?${queryString}` : ""}`,
      {
        headers,
      },
    );
  },
  getSessionDetails: (id: string, headers?: HeadersInit) =>
    apiFetch<Booking>(`/tutor/sessions/${id}`, { headers }),
  markSessionComplete: (id: string, headers?: HeadersInit) =>
    apiFetch<{ success: boolean }>(`/tutor/sessions/${id}/complete`, {
      method: "PATCH",
      headers,
    }),
  updateMeetingLink: (id: string, meetingLink: string, headers?: HeadersInit) =>
    apiFetch<{ success: boolean }>(`/tutor/sessions/${id}/meeting-link`, {
      method: "PATCH",
      body: JSON.stringify({ meetingLink }),
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
      `/tutor/reviews${queryString ? `?${queryString}` : ""}`,
      {
        headers,
      },
    );
  },
  getDashboardStats: (headers?: HeadersInit) =>
    apiFetch<TutorStats>("/tutor/dashboard", { headers }),
};
