import { tutorApi } from "@/api/tutor";
import SessionList from "@/components/tutor/SessionList";
import SessionPagination from "@/components/tutor/SessionPagination";
import SessionStatusFilter from "@/components/tutor/SessionStatusFilter";
import { Booking, PaginatedResponse } from "@/lib/types";
import { headers } from "next/headers";

export default async function ManageBookings({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const h = await headers();
  const params = await searchParams;
  const statusFilter = (params.status as string) || "ALL";
  const page = parseInt((params.page as string) || "1");

  const { data: result } = await tutorApi.listSessions(
    {
      status: statusFilter === "ALL" ? undefined : statusFilter,
      page,
      limit: 10,
    },
    h,
  );

  const response = result as unknown as PaginatedResponse<Booking>;

  const sessions = (response?.data || []).map((b: Booking) => ({
    ...b,
    id: b.bookingId || b.id,
  }));

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Manage Bookings
          </h1>
          <p className="text-gray-500 font-medium">
            Approve, complete, and track all your student sessions.
          </p>
        </div>

        <SessionStatusFilter />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <SessionList sessions={sessions} />
        <SessionPagination
          page={page}
          totalPages={response?.pagination?.totalPages || 1}
        />
      </div>
    </div>
  );
}
