"use client";

import { authClient } from "@/api/betterAuth";
import { changePasswordSchema } from "@/lib/validations";
import { CheckCircle2, Loader2, Lock, ShieldCheck } from "lucide-react";
import { useActionState, useState } from "react";
import { ZodError } from "zod";

export function ChangePasswordForm() {
  const [isExpanded, setIsExpanded] = useState(false);

  const [state, action, isPending] = useActionState(
    async (
      _prevState: { success: boolean; error?: string },
      formData: FormData,
    ) => {
      const currentPassword = formData.get("currentPassword") as string;
      const newPassword = formData.get("newPassword") as string;
      const confirmPassword = formData.get("confirmPassword") as string;

      try {
        const validated = changePasswordSchema.parse({
          currentPassword,
          newPassword,
          confirmPassword,
        });

        const { error } = await authClient.changePassword({
          newPassword: validated.newPassword,
          currentPassword: validated.currentPassword,
          revokeOtherSessions: true,
        });

        if (error) {
          return {
            success: false,
            error: error.message || "Failed to change password",
          };
        }

        return { success: true, error: undefined };
      } catch (err) {
        if (err instanceof ZodError) {
          return { success: false, error: err.issues[0].message };
        }
        return { success: false, error: "An unexpected error occurred" };
      }
    },
    { success: false, error: undefined },
  );

  if (state.success) {
    return (
      <div className="bg-green-50 border border-green-100 rounded-3xl p-8 text-center space-y-4">
        <div className="flex justify-center">
          <CheckCircle2 className="w-12 h-12 text-green-500" />
        </div>
        <h3 className="text-xl font-bold text-green-900">Password Updated!</h3>
        <p className="text-green-700 font-medium">
          Your password has been successfully changed and other sessions have
          been revoked.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-colors"
        >
          Done
        </button>
      </div>
    );
  }

  if (!isExpanded) {
    return (
      <section className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Security</h3>
              <p className="text-sm text-gray-500 font-medium">
                Keep your account secure by updating your password.
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsExpanded(true)}
            className="px-6 py-3 bg-gray-50 text-gray-700 font-bold rounded-2xl hover:bg-gray-100 transition-colors border border-gray-100"
          >
            Change Password
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 animate-in zoom-in-95 duration-200">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">Update Password</h3>
        </div>
        <button
          onClick={() => setIsExpanded(false)}
          className="text-sm font-bold text-gray-400 hover:text-gray-600"
        >
          Cancel
        </button>
      </div>

      <form action={action} className="max-w-md space-y-6">
        <div className="space-y-1.5">
          <label className="text-sm font-bold text-gray-700">
            Current Password
          </label>
          <input
            name="currentPassword"
            type="password"
            required
            className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all font-medium"
            placeholder="••••••••"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-bold text-gray-700">
            New Password
          </label>
          <input
            name="newPassword"
            type="password"
            required
            className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all font-medium"
            placeholder="••••••••"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-bold text-gray-700">
            Confirm New Password
          </label>
          <input
            name="confirmPassword"
            type="password"
            required
            className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all font-medium"
            placeholder="••••••••"
          />
        </div>

        {state.error && (
          <div className="p-4 bg-red-50 text-red-600 text-sm font-bold rounded-2xl border border-red-100">
            {state.error}
          </div>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="w-full py-4 bg-blue-600 text-white font-black rounded-2xl shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isPending ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            "Update Password"
          )}
        </button>
      </form>
    </section>
  );
}
