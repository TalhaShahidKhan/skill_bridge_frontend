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
    const params = new URLSearchParams(query as any).toString();
    return apiFetch(`/admin/users?${params}`, { headers });
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
    query: { page?: number; limit?: number },
    headers?: HeadersInit,
  ) => {
    const params = new URLSearchParams(query as any).toString();
    return apiFetch(`/admin/reviews?${params}`, { headers });
  },
  deleteReview: (id: string, headers?: HeadersInit) =>
    apiFetch(`/admin/reviews/${id}`, { method: "DELETE", headers }),
  listBookings: (
    query: { status?: string; page?: number; limit?: number },
    headers?: HeadersInit,
  ) => {
    const params = new URLSearchParams(query as any).toString();
    return apiFetch(`/admin/bookings?${params}`, { headers });
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
