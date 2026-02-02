import { authClient } from "@/api/betterAuth";
import { studentApi } from "@/api/student";
import { tutorApi } from "@/api/tutor";
import DeleteAccountSection from "@/components/shared/DeleteAccountSection";
import TutorProfileForm from "@/components/tutor/TutorProfileForm";
import { Category, Session, TutorProfile } from "@/lib/types";
import { headers } from "next/headers";

export default async function TutorProfilePage() {
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
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-top-4 duration-500">
      <header>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
          Professional Profile
        </h1>
        <p className="text-gray-500 font-medium font-outfit">
          Detailed profiles attract 3x more students.
        </p>
      </header>

      <TutorProfileForm
        initialData={profile}
        session={session as unknown as Session}
        categories={categories}
      />

      <DeleteAccountSection />
    </div>
  );
}
