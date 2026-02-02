import { HelpCircle, MoveLeft, Search } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-10 p-12 bg-white rounded-3xl shadow-xl shadow-blue-50 border border-gray-100">
        <div className="relative">
          <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto animate-pulse">
            <Search className="w-12 h-12 text-blue-600" />
          </div>
          <HelpCircle className="w-8 h-8 text-amber-400 absolute -top-2 -right-2 bg-white rounded-full shadow-sm" />
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl font-black text-gray-900 tracking-tight font-outfit">
            Page Not Found
          </h1>
          <p className="text-gray-500 font-medium leading-relaxed">
            Oops! The page you are looking for doesn&apos;t exist or has been
            moved to a different universe.
          </p>
        </div>

        <div className="pt-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-blue-100 group"
          >
            <MoveLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Back to Reality
          </Link>
        </div>
      </div>
    </div>
  );
}
