"use client";

import { authClient } from "@/api/betterAuth";
import { AdminSidebar } from "@/components/admin/Sidebar";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();
  useEffect(() => {
    if (!isPending) {
      if (!session) {
        router.push("/auth/login");
      } else if (session.user.role !== "ADMIN") {
        router.push("/"); // Redirect non-admins
      }
    }
  }, [session, isPending, router]);

  const isAuthorized = !isPending && session?.user.role === "ADMIN";

  if (isPending || !isAuthorized) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-slate-50 overflow-hidden">
      <AdminSidebar />
      <main className="flex-1 md:ml-64 overflow-y-auto transition-all duration-300">
        <div className="p-8 max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
