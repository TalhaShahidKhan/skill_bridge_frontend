"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

export default function BookingPagination({
  page,
  totalPages,
}: {
  page: number;
  totalPages: number;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function handlePageChange(newPage: number) {
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage.toString());
    router.push(`?${params.toString()}`);
  }

  if (totalPages <= 1) return null;

  return (
    <div className="p-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/50 text-neutral-950 font-semibold text-sm">
      <span>
        Page {page} of {totalPages}
      </span>
      <div className="flex items-center gap-2">
        <button
          disabled={page === 1}
          onClick={() => handlePageChange(page - 1)}
          className="p-2 border-2 border-gray-200 rounded-xl disabled:opacity-30 hover:bg-white transition-all bg-white shadow-sm active:scale-90"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          disabled={page === totalPages}
          onClick={() => handlePageChange(page + 1)}
          className="p-2 border-2 border-gray-200 rounded-xl disabled:opacity-30 hover:bg-white transition-all bg-white shadow-sm active:scale-90"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
