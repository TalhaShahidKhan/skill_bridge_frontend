"use client";

import { authClient } from "@/api/betterAuth";
import { signUpSchema } from "@/lib/validations";
import { CheckCircle2, Loader2, Lock, Mail, User } from "lucide-react";
import Link from "next/link";
import { useActionState, useState } from "react";
import { ZodError } from "zod";

export function SignUpForm() {
  const [role, setRole] = useState<"STUDENT" | "TUTOR">("STUDENT");

  const [state, action, isPending] = useActionState(
    async (_prevState: unknown, formData: FormData) => {
      const rawData = {
        name: formData.get("name") as string,
        email: formData.get("email") as string,
        password: formData.get("password") as string,
        role: formData.get("role") as string,
      };

      try {
        // Client-side/Action-side validation
        const validated = signUpSchema.parse(rawData);

        const { error } = await authClient.signUp.email({
          email: validated.email,
          password: validated.password,
          name: validated.name,
          role: validated.role,
        });

        if (error) {
          return { error: error.message || "Sign up failed" };
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
        <h2 className="text-2xl font-bold text-gray-800">Check your email</h2>
        <p className="text-gray-600">
          We&apos;ve sent a verification link to your inbox. Please check your
          email to complete registration.
        </p>
        <Link
          href="/auth/login"
          className="inline-block mt-4 text-blue-600 font-semibold hover:underline"
        >
          Back to login
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-8 bg-white rounded-2xl shadow-xl border border-gray-100">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Create an account
        </h2>
        <p className="text-gray-600">
          Join SkillBridge and start your learning journey.
        </p>
      </div>

      <form action={action} className="space-y-5">
        {/* Role Selection */}
        <div className="flex p-1 bg-gray-100 rounded-xl mb-6">
          <button
            type="button"
            onClick={() => setRole("STUDENT")}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
              role === "STUDENT"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Student
          </button>
          <button
            type="button"
            onClick={() => setRole("TUTOR")}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
              role === "TUTOR"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Tutor
          </button>
          <input type="hidden" name="role" value={role} />
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              name="name"
              type="text"
              required
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
              placeholder="John Doe"
            />
          </div>
        </div>

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
          <label className="block text-sm font-medium text-gray-700">
            Password
          </label>
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
            <span className="font-bold font-mono">!</span> {state.error}
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
              Creating account...
            </>
          ) : (
            "Create account"
          )}
        </button>

        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account?{" "}
          <Link
            href="/auth/login"
            className="text-blue-600 font-semibold hover:underline"
          >
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
}
