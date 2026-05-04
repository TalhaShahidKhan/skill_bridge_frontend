import { listTutorPaymentsAction } from "@/actions/tutor.actions";
import { Payment } from "@/lib/types";
import {
  CreditCard,
  Download,
  Filter,
  Search,
  ArrowUpRight,
  User,
  Calendar,
  DollarSign,
} from "lucide-react";
import Image from "next/image";

export default async function TutorPaymentsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = await searchParams;
  const currentPage = Number(page) || 1;

  const { data: paymentsRes, error } = await listTutorPaymentsAction({
    page: currentPage,
    limit: 10,
  });

  const payments = (paymentsRes?.data || []) as Payment[];
  const pagination = paymentsRes?.pagination;

  const totalEarnings = payments
    .filter((p) => p.status === "COMPLETED")
    .reduce((acc, p) => acc + p.amount, 0);

  return (
    <div className="p-8 space-y-10">
      {/* Header & Stats */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2 font-outfit">
            Payment History
          </h1>
          <p className="text-gray-500 font-medium">
            Manage and track all your earned tuition fees.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 min-w-[240px]">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-green-50 rounded-2xl flex items-center justify-center text-green-600">
                <DollarSign className="w-5 h-5" />
              </div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                Total Earnings
              </p>
            </div>
            <p className="text-3xl font-black text-gray-900">
              BDT {totalEarnings.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Filters & Actions */}
      <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search payments..."
            className="w-full pl-11 pr-4 py-3 bg-slate-50 border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm font-medium"
          />
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-slate-50 text-slate-600 font-bold rounded-2xl hover:bg-slate-100 transition-colors text-sm border border-slate-100">
          <Filter className="w-4 h-4" /> Filters
        </button>
        <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-100 text-sm">
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-4xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-50">
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Student
                </th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Date
                </th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Amount
                </th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Status
                </th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {payments.length > 0 ? (
                payments.map((payment) => (
                  <tr key={payment.paymentId} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-slate-100 rounded-2xl overflow-hidden relative shrink-0">
                          {payment.student?.user?.image ? (
                            <Image
                              src={payment.student.user.image}
                              alt=""
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <User className="w-5 h-5 text-slate-400 m-auto mt-2.5" />
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 leading-none mb-1">
                            {payment.student?.user?.name || "Unknown Student"}
                          </p>
                          <p className="text-xs text-slate-400 font-medium">
                            {payment.student?.user?.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2 text-slate-600 font-semibold text-sm">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        {new Date(payment.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <p className="font-black text-slate-900">
                        BDT {payment.amount.toLocaleString()}
                      </p>
                    </td>
                    <td className="px-8 py-6">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                          payment.status === "COMPLETED"
                            ? "bg-green-50 text-green-600 border-green-100"
                            : payment.status === "PENDING"
                            ? "bg-amber-50 text-amber-600 border-amber-100"
                            : "bg-red-50 text-red-600 border-red-100"
                        }`}
                      >
                        {payment.status}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <button className="w-10 h-10 bg-white border border-slate-100 rounded-xl flex items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-100 hover:bg-blue-50 transition-all">
                        <ArrowUpRight className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center justify-center space-y-4">
                      <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-200">
                        <CreditCard className="w-10 h-10" />
                      </div>
                      <p className="text-slate-400 font-bold">No payments found.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="px-8 py-6 border-t border-slate-50 flex items-center justify-between">
            <p className="text-xs text-slate-400 font-bold">
              Showing {payments.length} of {pagination.total} payments
            </p>
            <div className="flex items-center gap-2">
              <button
                disabled={currentPage <= 1}
                className="px-4 py-2 text-xs font-bold text-slate-600 bg-slate-50 rounded-xl disabled:opacity-50 hover:bg-slate-100 transition-colors"
              >
                Previous
              </button>
              <button
                disabled={currentPage >= pagination.totalPages}
                className="px-4 py-2 text-xs font-bold text-white bg-blue-600 rounded-xl disabled:opacity-50 hover:bg-blue-700 transition-colors shadow-md shadow-blue-100"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
