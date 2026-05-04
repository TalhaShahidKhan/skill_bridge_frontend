"use client";

import { PaginatedResponse, Payment } from "@/lib/types";
import { CreditCard, Search, User } from "lucide-react";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Pagination } from "./Pagination";

interface AdminPaymentsClientProps {
  initialData?: PaginatedResponse<Payment>;
}

export function AdminPaymentsClient({ initialData }: AdminPaymentsClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (search) params.set("search", search);
    else params.delete("search");
    params.set("page", "1");
    router.push(`/admin/payments?${params.toString()}`);
  };

  const payments = initialData?.data || [];

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <form
        onSubmit={handleSearch}
        className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-200"
      >
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by student/tutor name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium"
          />
        </div>
        <button
          type="submit"
          className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 active:scale-95"
        >
          Search
        </button>
      </form>

      {/* Payments Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-200">
                <th className="px-6 py-4 text-sm font-bold text-slate-500 uppercase tracking-wider">
                  Transaction
                </th>
                <th className="px-6 py-4 text-sm font-bold text-slate-500 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-4 text-sm font-bold text-slate-500 uppercase tracking-wider">
                  Tutor
                </th>
                <th className="px-6 py-4 text-sm font-bold text-slate-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-4 text-sm font-bold text-slate-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-sm font-bold text-slate-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {payments.length > 0 ? (
                payments.map((payment) => (
                  <tr key={payment.paymentId} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
                          <CreditCard className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900 line-clamp-1 max-w-[120px]">
                            {payment.stripeSessionId}
                          </p>
                          <p className="text-xs font-semibold text-slate-400">
                            Stripe ID
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                          <User className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">
                            {payment.student?.user?.name || "Unknown"}
                          </p>
                          <p className="text-xs font-semibold text-slate-400">
                            {payment.student?.user?.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600">
                          <User className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">
                            {payment.tutor?.user?.name || "Unknown"}
                          </p>
                          <p className="text-xs font-semibold text-slate-400">
                            {payment.tutor?.user?.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-black text-slate-900">
                        {payment.amount.toLocaleString(undefined, {
                          style: "currency",
                          currency: payment.currency,
                        })}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          payment.status === "COMPLETED"
                            ? "bg-emerald-100 text-emerald-600"
                            : payment.status === "PENDING"
                              ? "bg-amber-100 text-amber-600"
                              : "bg-red-100 text-red-600"
                        }`}
                      >
                        {payment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-slate-600">
                        {new Date(payment.createdAt).toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                      <p className="text-xs font-semibold text-slate-400">
                        {new Date(payment.createdAt).toLocaleTimeString(undefined, {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400 italic font-medium">
                    No transactions found matching your criteria
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {initialData?.pagination && (
          <div className="p-4 bg-slate-50/50 border-t border-slate-200">
            <Pagination pagination={initialData.pagination} />
          </div>
        )}
      </div>
    </div>
  );
}
