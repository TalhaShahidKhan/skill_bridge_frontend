import { authClient } from "@/api/betterAuth";
import { studentApi } from "@/api/student";
import DeleteAccountSection from "@/components/shared/DeleteAccountSection";
import StudentProfileForm from "@/components/student/StudentProfileForm";
import { Session, StudentProfile } from "@/lib/types";
import { Metadata } from "next";
import { headers } from "next/headers";

export const metadata: Metadata = {
  title: "My Profile | Skill Bridge",
  description: "Update your student profile and contact information.",
};

export default async function ProfilePage() {
  const h = await headers();
  const [{ data: result }, { data: session }] = await Promise.all([
    studentApi.getProfile(h),
    authClient.getSession({ fetchOptions: { headers: h } }),
  ]);

  const profile =
    (result as unknown as { profile: StudentProfile })?.profile || null;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-top-4 duration-500">
      <header>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
          My Profile
        </h1>
        <p className="text-gray-500 font-medium">
          Keep your information up to date to help tutors know you better.
        </p>
      </header>

      <StudentProfileForm
        initialData={profile}
        session={session as unknown as Session}
      />

      <DeleteAccountSection />
    </div>
  );
}
