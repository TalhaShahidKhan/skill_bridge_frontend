import { adminApi } from "@/api/admin";
import { AdminPaymentsClient } from "@/components/admin/AdminPaymentsClient";
import { Metadata } from "next";
import { headers } from "next/headers";

export const metadata: Metadata = {
  title: "Payment Management | Admin",
};

export default async function AdminPaymentsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string }>;
}) {
  const params = await searchParams;
  const h = await headers();
  const { data: result, error } = await adminApi.listPayments(
    {
      page: params.page ? parseInt(params.page) : 1,
      search: params.search,
    },
    { cookie: h.get("cookie") || "" },
  );

  if (error) {
    return (
      <div className="p-8 text-center bg-red-50 text-red-600 rounded-2xl border border-red-100">
        <p className="font-bold text-lg">Error loading payments</p>
        <p className="text-sm opacity-80">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight font-outfit">
          Financial Oversight
        </h1>
        <p className="text-slate-500 font-medium">
          Monitor and audit all platform transactions.
        </p>
      </header>

      <AdminPaymentsClient initialData={result ?? undefined} />
    </div>
  );
}
