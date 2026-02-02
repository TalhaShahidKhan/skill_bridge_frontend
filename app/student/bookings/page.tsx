import { studentApi } from "@/api/student";
import BookingList from "@/components/student/BookingList";
import BookingPagination from "@/components/student/BookingPagination";
import BookingStatusFilter from "@/components/student/BookingStatusFilter";
import { AlertCircle } from "lucide-react";
import { Metadata } from "next";
import { headers } from "next/headers";

export const metadata: Metadata = {
  title: "My Bookings | Skill Bridge",
  description: "View and manage your tutoring booking requests and status.",
};

interface BookingResponse {
  bookingId: string;
  status: string;
  date: string;
  time: string;
  duration: number;
  review?: { rating: number } | null;
  tutor?: {
    subjects?: string[];
    address?: string;
    user?: {
      name: string;
      image?: string | null;
    };
  };
}

export default async function BookingsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const h = await headers();
  const params = await searchParams;
  const statusFilter = (params.status as string) || "ALL";
  const page = parseInt((params.page as string) || "1");

  const { data: result } = await studentApi.listBookings(
    {
      status: statusFilter === "ALL" ? undefined : statusFilter,
      page,
      limit: 10,
    },
    h,
  );

  // API returns { pagination, data } structure
  const response = result as unknown as {
    pagination?: { totalPages: number };
    data?: BookingResponse[];
  };

  // Map bookingId to id for the BookingList component
  const bookings = (response?.data || []).map((b) => ({
    ...b,
    id: b.bookingId,
  }));

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            My Bookings
          </h1>
          <p className="text-gray-500 font-medium">
            Manage your tutoring sessions and learning schedule.
          </p>
        </div>

        <BookingStatusFilter />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <BookingList bookings={bookings} />
        <BookingPagination
          page={page}
          totalPages={response?.pagination?.totalPages || 1}
        />
      </div>

      <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 flex items-center gap-4">
        <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white shrink-0 shadow-lg shadow-blue-200">
          <AlertCircle className="w-6 h-6" />
        </div>
        <div>
          <h3 className="font-bold text-blue-900 leading-tight">
            Booking Policy
          </h3>
          <p className="text-sm text-blue-700 font-medium">
            Please note that sessions can only be cancelled up to 24 hours
            before the scheduled time. Complete your sessions on time to
            maintain a good student rating.
          </p>
        </div>
      </div>
    </div>
  );
}
