"use server";

import { adminApi } from "@/api/admin";
import { UserRole, UserStatus } from "@/lib/types";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

async function getAuthHeaders() {
  const h = await headers();
  return {
    cookie: h.get("cookie") || "",
  };
}

export async function getAdminAnalyticsAction() {
  const h = await getAuthHeaders();
  return adminApi.getAnalytics(h);
}

export async function listAdminUsersAction(query: {
  search?: string;
  role?: string;
  page?: number;
  limit?: number;
}) {
  const h = await getAuthHeaders();
  return adminApi.listUsers(query, h);
}

export async function updateUserRoleAction(id: string, role: UserRole) {
  const h = await getAuthHeaders();
  const res = await adminApi.updateUserRole(id, role, h);
  revalidatePath("/admin/users");
  return res;
}

export async function updateUserStatusAction(id: string, status: UserStatus) {
  const h = await getAuthHeaders();
  const res = await adminApi.updateUserStatus(id, status, h);
  revalidatePath("/admin/users");
  return res;
}

export async function suspendUserAction(id: string) {
  const h = await getAuthHeaders();
  const res = await adminApi.suspendUser(id, h);
  revalidatePath("/admin/users");
  return res;
}

export async function activateUserAction(id: string) {
  const h = await getAuthHeaders();
  const res = await adminApi.activateUser(id, h);
  revalidatePath("/admin/users");
  return res;
}

export async function deleteUserAction(id: string) {
  const h = await getAuthHeaders();
  const res = await adminApi.deleteUser(id, h);
  revalidatePath("/admin/users");
  return res;
}

export async function setTutorFeaturedAction(id: string, isFeatured: boolean) {
  const h = await getAuthHeaders();
  const res = await adminApi.setTutorFeatured(id, isFeatured, h);
  revalidatePath("/admin");
  return res;
}

export async function createCategoryAction(data: {
  name: string;
  subjects?: string[];
}) {
  const h = await getAuthHeaders();
  const res = await adminApi.createCategory(data, h);
  revalidatePath("/admin/categories");
  return res;
}

export async function updateCategoryAction(
  id: string,
  data: { name?: string; subjects?: string[] },
) {
  const h = await getAuthHeaders();
  const res = await adminApi.updateCategory(id, data, h);
  revalidatePath("/admin/categories");
  return res;
}

export async function deleteCategoryAction(id: string) {
  const h = await getAuthHeaders();
  const res = await adminApi.deleteCategory(id, h);
  revalidatePath("/admin/categories");
  return res;
}
