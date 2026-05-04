import { authClient } from "@/api/betterAuth";
import { studentApi } from "@/api/student";
import StudentProfileForm from "@/components/student/StudentProfileForm";
import { Session, StudentProfile } from "@/lib/types";
import { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Edit Profile | Skill Bridge",
  description: "Update your student profile and contact information.",
};

export default async function EditProfilePage() {
  const h = await headers();
  const [{ data: result }, { data: session }] = await Promise.all([
    studentApi.getProfile(h),
    authClient.getSession({ fetchOptions: { headers: h } }),
  ]);

  const profile = (result as unknown as StudentProfile) || null;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-top-4 duration-500 font-outfit">
      <header className="space-y-4">
        <Link 
            href="/student/profile" 
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors"
        >
            <ChevronLeft className="w-4 h-4" />
            Back to Profile
        </Link>
        <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                Edit Profile
            </h1>
            <p className="text-gray-500 font-medium">
                Update your personal information and preferences.
            </p>
        </div>
      </header>

      <StudentProfileForm
        initialData={profile}
        session={session as unknown as Session}
      />
    </div>
  );
}
