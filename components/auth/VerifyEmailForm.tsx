"use client";

import { authClient } from "@/api/betterAuth";
import { ArrowRight, CheckCircle2, Loader2, XCircle } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export function VerifyEmailForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function verify() {
      if (!token) {
        setStatus("error");
        setError("Missing verification token.");
        return;
      }

      try {
        const { error: verifyError } = await authClient.verifyEmail({
          query: {
            token,
          },
        });

        if (verifyError) {
          setStatus("error");
          setError(verifyError.message || "Email verification failed.");
          return;
        }

        setStatus("success");
      } catch (err) {
        console.error("Verification error:", err);
        setStatus("error");
        setError("An unexpected error occurred.");
      }
    }

    verify();
  }, [token]);

  if (status === "loading") {
    return (
      <div className="max-w-md mx-auto p-8 bg-white rounded-2xl shadow-xl border border-gray-100 text-center space-y-4">
        <div className="flex justify-center">
          <Loader2 className="w-16 h-16 text-blue-500 animate-spin" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 font-outfit">
          Verifying Email...
        </h2>
        <p className="text-gray-600">
          Please wait while we verify your email address.
        </p>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="max-w-md mx-auto p-8 bg-white rounded-2xl shadow-xl border border-gray-100 text-center space-y-4">
        <div className="flex justify-center">
          <CheckCircle2 className="w-16 h-16 text-green-500 animate-bounce" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 font-outfit">
          Email Verified!
        </h2>
        <p className="text-gray-600">
          Your email has been successfully verified. You can now sign in to your
          account.
        </p>
        <Link
          href="/auth/login"
          className="inline-flex items-center gap-2 px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors mt-4"
        >
          Go to Login <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-8 bg-white rounded-2xl shadow-xl border border-gray-100 text-center space-y-4">
      <div className="flex justify-center">
        <XCircle className="w-16 h-16 text-red-500" />
      </div>
      <h2 className="text-2xl font-bold text-gray-800 font-outfit">
        Verification Failed
      </h2>
      <p className="text-red-600">{error}</p>
      <Link
        href="/auth/login"
        className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:underline mt-4"
      >
        Back to login
      </Link>
    </div>
  );
}
