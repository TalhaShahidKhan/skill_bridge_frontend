"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function SessionStatusFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentStatus = searchParams.get("status") || "ALL";

  const statuses = ["ALL", "CONFIRMED", "COMPLETED", "CANCELLED"];

  function handleFilter(status: string) {
    const params = new URLSearchParams(searchParams);
    if (status === "ALL") params.delete("status");
    else params.set("status", status);
    params.set("page", "1");
    router.push(`?${params.toString()}`);
  }

  return (
    <div className="flex items-center gap-2 bg-white p-1 rounded-xl shadow-sm border border-gray-100">
      {statuses.map((s) => (
        <button
          key={s}
          onClick={() => handleFilter(s)}
          className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
            currentStatus === s
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-100"
              : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
          }`}
        >
          {s.charAt(0) + s.slice(1).toLowerCase()}
        </button>
      ))}
    </div>
  );
}
