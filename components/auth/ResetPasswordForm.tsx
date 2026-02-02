"use client";

import { authClient } from "@/api/betterAuth";
import { resetPasswordSchema } from "@/lib/validations";
import { ArrowRight, CheckCircle2, Loader2, Lock } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useActionState } from "react";
import { ZodError } from "zod";

export function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [state, action, isPending] = useActionState(
    async (_prevState: unknown, formData: FormData) => {
      const rawData = {
        newPassword: formData.get("newPassword") as string,
        confirmPassword: formData.get("confirmPassword") as string,
      };

      try {
        if (!token) {
          return {
            error: "Reset token missing. Please use the link from your email.",
          };
        }

        // Validation
        const validated = resetPasswordSchema.parse(rawData);

        const { error } = await authClient.resetPassword({
          newPassword: validated.newPassword,
          token: token,
        });

        if (error) {
          return { error: error.message || "Failed to update password" };
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
        <h2 className="text-2xl font-bold text-gray-800">Password Updated!</h2>
        <p className="text-gray-600">
          Your password has been successfully changed. You can now sign in with
          your new credentials.
        </p>
        <Link
          href="/auth/login"
          className="inline-flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors mt-4"
        >
          Go to Sign In <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-8 bg-white rounded-2xl shadow-xl border border-gray-100">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Set New Password
        </h2>
        <p className="text-gray-600">
          Please choose a strong password for your account.
        </p>
      </div>

      <form action={action} className="space-y-6">
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            New Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              name="newPassword"
              type="password"
              required
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
              placeholder="••••••••"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Confirm New Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              name="confirmPassword"
              type="password"
              required
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
              placeholder="••••••••"
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
              Updating password...
            </>
          ) : (
            "Update password"
          )}
        </button>
      </form>
    </div>
  );
}
