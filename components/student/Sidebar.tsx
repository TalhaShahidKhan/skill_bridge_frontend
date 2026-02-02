"use client";

import { authClient } from "@/api/betterAuth";
import {
  BookOpen,
  Calendar,
  LayoutDashboard,
  LogOut,
  Search,
  Star,
  UserCircle,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const menuItems = [
  { icon: LayoutDashboard, label: "Overview", href: "/student" },
  { icon: Calendar, label: "My Bookings", href: "/student/bookings" },
  { icon: UserCircle, label: "Profile", href: "/student/profile" },
  { icon: Star, label: "Reviews", href: "/student/reviews" },
  { icon: Search, label: "Browse Tutors", href: "/tutors" },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push("/auth/login");
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col h-full shadow-sm">
      <div className="p-6 border-b border-gray-100 flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-100">
          <BookOpen className="text-white w-6 h-6" />
        </div>
        <span className="font-bold text-xl text-gray-800 tracking-tight font-outfit">
          SkillBridge
        </span>
      </div>

      <nav className="flex-1 p-4 space-y-1 mt-4">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive
                  ? "bg-blue-50 text-blue-600 shadow-sm"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
              }`}
            >
              <item.icon
                className={`w-5 h-5 transition-transform group-hover:scale-110 ${isActive ? "text-blue-600" : "text-gray-400 group-hover:text-gray-600"}`}
              />
              <span className="font-semibold">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-100 mb-4">
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 w-full px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200 group"
        >
          <LogOut className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          <span className="font-semibold">Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
