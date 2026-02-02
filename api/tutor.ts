import { TutorProfile } from "@/lib/types";
import { apiFetch } from "./client";

export const tutorApi = {
  getProfile: (headers?: HeadersInit) => apiFetch("/tutor/me", { headers }),
  upsertProfile: (data: Partial<TutorProfile>, headers?: HeadersInit) =>
    apiFetch("/tutor/me", {
      method: "PUT",
      body: JSON.stringify(data),
      headers,
    }),
  updateProfile: (data: Partial<TutorProfile>, headers?: HeadersInit) =>
    apiFetch("/tutor/me", {
      method: "PATCH",
      body: JSON.stringify(data),
      headers,
    }),
  setAvailability: (
    data: { availableFrom: string; availableTo: string; isAvailable: boolean },
    headers?: HeadersInit,
  ) =>
    apiFetch("/tutor/availability", {
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
    return apiFetch(`/tutor/sessions${queryString ? `?${queryString}` : ""}`, {
      headers,
    });
  },
  getSessionDetails: (id: string, headers?: HeadersInit) =>
    apiFetch(`/tutor/sessions/${id}`, { headers }),
  markSessionComplete: (id: string, headers?: HeadersInit) =>
    apiFetch(`/tutor/sessions/${id}/complete`, {
      method: "PATCH",
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
    return apiFetch(`/tutor/reviews${queryString ? `?${queryString}` : ""}`, {
      headers,
    });
  },
  getDashboardStats: (headers?: HeadersInit) =>
    apiFetch("/tutor/dashboard", { headers }),
};
