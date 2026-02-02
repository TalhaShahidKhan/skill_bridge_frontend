"use client";

import { authClient } from "@/api/betterAuth";
import {
  BarChart,
  LayoutDashboard,
  List,
  LogOut,
  MessageSquare,
  ShieldCheck,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const menuItems = [
  { icon: LayoutDashboard, label: "Overview", href: "/admin" },
  { icon: Users, label: "Users & Tutors", href: "/admin/users" },
  { icon: List, label: "Bookings", href: "/admin/bookings" },
  { icon: MessageSquare, label: "Reviews", href: "/admin/reviews" },
  { icon: BarChart, label: "Categories", href: "/admin/categories" },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push("/auth/login");
  };

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 hidden md:flex flex-col fixed left-0 top-16 bottom-0 z-40 h-[calc(100vh-4rem)]">
      <div className="p-6 border-b border-slate-800 flex items-center gap-3">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-900/20">
          <ShieldCheck className="text-white w-6 h-6" />
        </div>
        <span className="font-bold text-xl text-white tracking-tight font-outfit">
          Admin Panel
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
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/30"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <item.icon
                className={`w-5 h-5 transition-transform group-hover:scale-110 ${isActive ? "text-white" : "text-slate-500 group-hover:text-white"}`}
              />
              <span className="font-semibold">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800 mb-4">
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 w-full px-4 py-3 text-red-500 hover:bg-red-500/10 rounded-xl transition-all duration-200 group"
        >
          <LogOut className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          <span className="font-semibold">Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
