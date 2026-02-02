"use client";

import { authClient } from "@/api/betterAuth";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/auth/login");
        },
      },
    });
  };

  return (
    <nav className="sticky top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-10 h-10 overflow-hidden rounded-xl shadow-lg shadow-blue-100 group-hover:scale-110 transition-transform duration-300">
                <Image
                  src="/logo.png"
                  alt="Skill Bridge Logo"
                  fill
                  className="object-cover"
                />
              </div>
              <span className="text-2xl font-black text-slate-800 tracking-tight font-outfit">
                Skill<span className="text-blue-600">Bridge</span>
              </span>
            </Link>

            <div className="hidden md:ml-10 md:flex md:space-x-8">
              <Link
                href="/tutors"
                className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
              >
                Browse Tutors
              </Link>
              {session && (
                <Link
                  href={
                    session.user.role === "ADMIN"
                      ? "/admin"
                      : session.user.role === "TUTOR"
                        ? "/tutor"
                        : "/student"
                  }
                  className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
                >
                  Dashboard
                </Link>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            {isPending ? (
              <div className="animate-pulse flex space-x-4">
                <div className="rounded-full bg-gray-200 h-10 w-10"></div>
              </div>
            ) : session ? (
              <div className="flex items-center gap-4">
                <div className="flex-col items-end hidden sm:flex">
                  <span className="text-sm font-semibold text-gray-900">
                    {session.user.name}
                  </span>
                  <span className="text-xs text-gray-500 uppercase tracking-wider">
                    {session.user.role}
                  </span>
                </div>
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold border-2 border-white shadow-sm">
                  {session.user.name.charAt(0)}
                </div>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/auth/login"
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-sm transition-all transform active:scale-95"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
