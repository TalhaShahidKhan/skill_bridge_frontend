"use client";

import { authClient } from "@/api/betterAuth";
import { forgotPasswordSchema } from "@/lib/validations";
import { ArrowLeft, CheckCircle2, Loader2, Mail } from "lucide-react";
import Link from "next/link";
import { useActionState } from "react";
import { ZodError } from "zod";

export function ForgotPasswordForm() {
  const [state, action, isPending] = useActionState(
    async (_prevState: unknown, formData: FormData) => {
      const email = formData.get("email") as string;

      try {
        // Validation
        const validated = forgotPasswordSchema.parse({ email });

        const { error } = await authClient.requestPasswordReset({
          email: validated.email,
          redirectTo: "/auth/reset-password",
        });

        if (error) {
          return { error: error.message || "Failed to send reset link" };
        }

        return { success: true };
      } catch (err) {
        if (err instanceof ZodError) {
          return { error: err.issues[0].message };
        }
        return { error: "An unexpected error occurred" };
      }
    },
    { success: false },
  );

  if (state.success) {
    return (
      <div className="max-w-md mx-auto p-8 bg-white rounded-2xl shadow-xl border border-gray-100 text-center space-y-4">
        <div className="flex justify-center">
          <CheckCircle2 className="w-16 h-16 text-green-500 animate-bounce" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Email Sent!</h2>
        <p className="text-gray-600">
          If an account exists with that email, we&apos;ve sent a password reset
          link.
        </p>
        <Link
          href="/auth/login"
          className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:underline mt-4"
        >
          <ArrowLeft className="w-4 h-4" /> Back to login
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-8 bg-white rounded-2xl shadow-xl border border-gray-100">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Reset Password
        </h2>
        <p className="text-gray-600">
          Enter your email and we&apos;ll send you a link to reset your
          password.
        </p>
      </div>

      <form action={action} className="space-y-6">
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              name="email"
              type="email"
              required
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
              placeholder="you@example.com"
            />
          </div>
        </div>

        {state.error && (
          <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 flex gap-2">
            <span className="font-bold">!</span> {state.error}
          </div>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg shadow-blue-200 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Sending link...
            </>
          ) : (
            "Send reset link"
          )}
        </button>

        <div className="text-center">
          <Link
            href="/auth/login"
            className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to login
          </Link>
        </div>
      </form>
    </div>
  );
}
