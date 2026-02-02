import { VerifyEmailForm } from "@/components/auth/VerifyEmailForm";
import { Loader2 } from "lucide-react";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Verify Email | Skill Bridge",
  description:
    "Verify your email address to activate your Skill Bridge account.",
};

export default function VerifyEmailPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <Suspense
        fallback={
          <div className="max-w-md mx-auto p-8 bg-white rounded-2xl shadow-xl border border-gray-100 text-center space-y-4">
            <div className="flex justify-center">
              <Loader2 className="w-16 h-16 text-blue-500 animate-spin" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Loading...</h2>
          </div>
        }
      >
        <VerifyEmailForm />
      </Suspense>
    </div>
  );
}
