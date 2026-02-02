import { adminApi } from "@/api/admin";
import Pagination from "@/components/admin/Pagination";
import UserSearch from "@/components/admin/UserSearch";
import UsersTable from "@/components/admin/UsersTable";
import { PaginatedResponse, User } from "@/lib/types";
import { Loader2 } from "lucide-react";
import { headers } from "next/headers";
import { Suspense } from "react";

export default async function UsersPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const h = await headers();
  const params = await searchParams;
  const search = (params.search as string) || "";
  const page = parseInt((params.page as string) || "1");

  const { data: result, error } = await adminApi.listUsers(
    {
      page,
      limit: 10,
      ...(search ? { search } : {}),
    },
    {
      cookie: h.get("cookie") || "",
    },
  );
  const response = result as PaginatedResponse<User> & { users?: User[] };
  const users = response?.users || response?.data || [];
  const pagination = response?.pagination;

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight font-outfit">
          User Management
        </h1>
        <p className="text-slate-500 font-medium">
          Manage user accounts, roles, and permissions.
        </p>
      </header>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <UserSearch />
        </div>

        {/* Table */}
        <Suspense
          fallback={
            <div className="p-12 text-center">
              <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mx-auto" />
            </div>
          }
        >
          <UsersTable users={users} />
        </Suspense>

        {/* Pagination */}
        <Pagination page={page} totalPages={pagination?.totalPages || 1} />
      </div>

      {error && <p className="text-red-500 font-medium text-center">{error}</p>}
    </div>
  );
}
