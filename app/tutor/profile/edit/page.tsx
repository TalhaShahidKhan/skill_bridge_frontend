import { authClient } from "@/api/betterAuth";
import { studentApi } from "@/api/student";
import { tutorApi } from "@/api/tutor";
import TutorProfileForm from "@/components/tutor/TutorProfileForm";
import { Category, Session, TutorProfile } from "@/lib/types";
import { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Edit Tutor Profile | Skill Bridge",
  description: "Update your tutor information, subjects, and teaching preferences.",
};

export default async function EditTutorProfilePage() {
  const h = await headers();
  const [profileRes, catsRes, sessionRes] = await Promise.all([
    tutorApi.getProfile(h),
    studentApi.listCategories(),
    authClient.getSession({ fetchOptions: { headers: h } }),
  ]);

  const profile = profileRes.data as unknown as TutorProfile;
  const categories = (catsRes.data as unknown as Category[]) || [];
  const session = sessionRes.data;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-top-4 duration-500 font-outfit">
      <header className="space-y-4">
        <Link 
            href="/tutor/profile" 
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors"
        >
            <ChevronLeft className="w-4 h-4" />
            Back to Profile
        </Link>
        <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                Edit Professional Profile
            </h1>
            <p className="text-gray-500 font-medium">
                Update your credentials and availability to reach more students.
            </p>
        </div>
      </header>

      <TutorProfileForm
        initialData={profile}
        session={session as unknown as Session}
        categories={categories}
      />
    </div>
  );
}
