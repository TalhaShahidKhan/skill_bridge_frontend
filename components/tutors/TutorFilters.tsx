"use client";

import { Filter, Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

export default function TutorFilters({ categories }: { categories: string[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const handleSearch = (term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) params.set("search", term);
    else params.delete("search");

    startTransition(() => {
      router.push(`?${params.toString()}`);
    });
  };

  const handleCategoryChange = (cat: string) => {
    const params = new URLSearchParams(searchParams);
    if (cat === "All") params.delete("category");
    else params.set("category", cat);

    startTransition(() => {
      router.push(`?${params.toString()}`);
    });
  };

  return (
    <div
      className={`bg-white p-4 rounded-2xl shadow-xl shadow-blue-50 border border-gray-100 flex flex-col md:flex-row gap-4 mb-12 ${isPending ? "opacity-50" : ""}`}
    >
      <div className="flex-1 relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search by subject or tutor name..."
          defaultValue={searchParams.get("search")?.toString()}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all font-medium"
        />
      </div>
      <div className="md:w-64 relative">
        <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        <select
          value={searchParams.get("category") || "All"}
          onChange={(e) => handleCategoryChange(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all font-semibold appearance-none"
        >
          <option value="All">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
