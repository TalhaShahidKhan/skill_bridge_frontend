"use client";

import { authClient } from "@/api/betterAuth";
import { signInSchema } from "@/lib/validations";
import { Loader2, Lock, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState } from "react";
import { ZodError } from "zod";

export function SignInForm() {
  const router = useRouter();

  const [state, action, isPending] = useActionState(
    async (_prevState: unknown, formData: FormData) => {
      const rawData = {
        email: formData.get("email") as string,
        password: formData.get("password") as string,
      };

      try {
        // Validation
        const validated = signInSchema.parse(rawData);

        const { error } = await authClient.signIn.email({
          email: validated.email,
          password: validated.password,
          callbackURL: "/", // Redirect after success if needed
        });

        if (error) {
          if (error.message?.includes("Email not verified")) {
            return {
              error:
                "Your email is not verified. Please check your inbox for the verification link.",
            };
          }
          return { error: error.message || "Invalid email or password" };
        }

        const { data: session } = await authClient.getSession();

        if (session) {
          const dashboardPath =
            session.user.role === "ADMIN"
              ? "/admin"
              : session.user.role === "TUTOR"
                ? "/tutor"
                : "/student";
          router.push(dashboardPath);
        } else {
          router.push("/");
        }

        router.refresh();
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

  return (
    <div className="max-w-md mx-auto p-8 bg-white rounded-2xl shadow-xl border border-gray-100">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h2>
        <p className="text-gray-600">Please enter your details to sign in.</p>
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

        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <Link
              href="/auth/forgot-password"
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              name="password"
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
              Signing in...
            </>
          ) : (
            "Sign in"
          )}
        </button>

        <p className="text-center text-sm text-gray-600 mt-6">
          Don&apos;t have an account?{" "}
          <Link
            href="/auth/signup"
            className="text-blue-600 font-semibold hover:underline"
          >
            Create account
          </Link>
        </p>
      </form>
    </div>
  );
}
