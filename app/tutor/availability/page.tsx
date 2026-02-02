import { tutorApi } from "@/api/tutor";
import AvailabilityForm from "@/components/tutor/AvailabilityForm";
import { Metadata } from "next";
import { headers } from "next/headers";

export const metadata: Metadata = {
  title: "Set Availability | Skill Bridge",
  description:
    "Manage your teaching hours and availability status for students.",
};

export default async function AvailabilityPage() {
  const h = await headers();
  const { data } = await tutorApi.getProfile(h);

  const initialData = data as unknown as {
    availableFrom: string;
    availableTo: string;
    isAvailable: boolean;
  } | null;

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-top-4 duration-500">
      <header>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
          Set Availability
        </h1>
        <p className="text-gray-500 font-medium">
          Define when you are available to take new students.
        </p>
      </header>

      <AvailabilityForm initialData={initialData} />
    </div>
  );
}
