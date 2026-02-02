import { UserRole, UserStatus } from "@/lib/types";
import { apiFetch } from "./client";

export const adminApi = {
  getAnalytics: (headers?: HeadersInit) =>
    apiFetch("/admin/analytics", { headers }),
  listUsers: (
    query: {
      search?: string;
      role?: string;
      page?: number;
      limit?: number;
    },
    headers?: HeadersInit,
  ) => {
    const params = new URLSearchParams();
    if (query.search) params.set("search", query.search);
    if (query.role) params.set("role", query.role);
    if (query.page) params.set("page", query.page.toString());
    if (query.limit) params.set("limit", query.limit.toString());
    return apiFetch(`/admin/users?${params.toString()}`, { headers });
  },
  getUser: (id: string, headers?: HeadersInit) =>
    apiFetch(`/admin/users/${id}`, { headers }),
  updateUserRole: (id: string, role: UserRole, headers?: HeadersInit) =>
    apiFetch(`/admin/users/${id}/role`, {
      method: "PATCH",
      body: JSON.stringify({ role }),
      headers,
    }),
  updateUserStatus: (id: string, status: UserStatus, headers?: HeadersInit) =>
    apiFetch(`/admin/users/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
      headers,
    }),
  suspendUser: (id: string, headers?: HeadersInit) =>
    apiFetch(`/admin/users/${id}/suspend`, { method: "PATCH", headers }),
  activateUser: (id: string, headers?: HeadersInit) =>
    apiFetch(`/admin/users/${id}/activate`, { method: "PATCH", headers }),
  deleteUser: (id: string, headers?: HeadersInit) =>
    apiFetch(`/admin/users/${id}`, { method: "DELETE", headers }),
  listReviews: (
    query: {
      page?: number;
      limit?: number;
      tutorId?: string;
      studentId?: string;
      minRating?: number;
      maxRating?: number;
    },
    headers?: HeadersInit,
  ) => {
    const params = new URLSearchParams();
    if (query.page) params.set("page", query.page.toString());
    if (query.limit) params.set("limit", query.limit.toString());
    if (query.tutorId) params.set("tutorId", query.tutorId);
    if (query.studentId) params.set("studentId", query.studentId);
    if (query.minRating) params.set("minRating", query.minRating.toString());
    if (query.maxRating) params.set("maxRating", query.maxRating.toString());
    return apiFetch(`/admin/reviews?${params.toString()}`, { headers });
  },
  deleteReview: (id: string, headers?: HeadersInit) =>
    apiFetch(`/admin/reviews/${id}`, { method: "DELETE", headers }),
  listBookings: (
    query: {
      status?: string;
      page?: number;
      limit?: number;
      search?: string;
      studentId?: string;
      tutorId?: string;
    },
    headers?: HeadersInit,
  ) => {
    const params = new URLSearchParams();
    if (query.status) params.set("status", query.status);
    if (query.page) params.set("page", query.page.toString());
    if (query.limit) params.set("limit", query.limit.toString());
    if (query.search) params.set("search", query.search);
    if (query.studentId) params.set("studentId", query.studentId);
    if (query.tutorId) params.set("tutorId", query.tutorId);
    return apiFetch(`/admin/bookings?${params.toString()}`, { headers });
  },
  setTutorFeatured: (id: string, isFeatured: boolean, headers?: HeadersInit) =>
    apiFetch(`/admin/tutors/${id}/featured`, {
      method: "PATCH",
      body: JSON.stringify({ isFeatured }),
      headers,
    }),
  createCategory: (
    data: { name: string; subjects?: string[] },
    headers?: HeadersInit,
  ) =>
    apiFetch("/admin/categories", {
      method: "POST",
      body: JSON.stringify(data),
      headers,
    }),
  updateCategory: (
    id: string,
    data: { name?: string; subjects?: string[] },
    headers?: HeadersInit,
  ) =>
    apiFetch(`/admin/categories/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
      headers,
    }),
  deleteCategory: (id: string, headers?: HeadersInit) =>
    apiFetch(`/admin/categories/${id}`, { method: "DELETE", headers }),
};
