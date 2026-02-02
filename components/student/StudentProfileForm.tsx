"use client";

import {
  ActionState,
  updateStudentProfileWithForm,
} from "@/actions/student.actions";
import {
  Book,
  CheckCircle,
  FileText,
  Home,
  Loader2,
  Phone,
  Save,
  School,
  User,
  Users,
} from "lucide-react";
import Image from "next/image";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";

import { Session, StudentProfile } from "@/lib/types";

export default function StudentProfileForm({
  initialData,
  session,
}: {
  initialData: StudentProfile | null;
  session: Session | null;
}) {
  const initialState: ActionState = { success: false };
  const [state, formAction, isPending] = useActionState(
    updateStudentProfileWithForm,
    initialState,
  );

  useEffect(() => {
    if (state?.success) {
      toast.success("Profile updated successfully!");
    } else if (state?.error) {
      toast.error(state.error);
    }
  }, [state]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Profile Card */}
      <div className="md:col-span-1 space-y-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
          {/* ... (Same Image/User code) ... */}
          <div className="w-24 h-24 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center border-4 border-white shadow-md overflow-hidden relative">
            {session?.user.image ? (
              <Image
                src={session.user.image}
                alt=""
                fill
                className="object-cover"
              />
            ) : (
              <User className="w-12 h-12 text-blue-600" />
            )}
          </div>
          <h2 className="text-xl font-bold text-gray-800 tracking-tight">
            {session?.user.name}
          </h2>
          <p className="text-sm text-gray-500 font-semibold mb-4">
            {session?.user.email}
          </p>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-black uppercase tracking-wider border border-green-100">
            <CheckCircle className="w-3 h-3" /> Student
          </div>
        </div>

        <div className="bg-blue-600 p-6 rounded-2xl text-white shadow-xl shadow-blue-100 relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all duration-500" />
          <FileText className="w-8 h-8 text-blue-200 mb-4" />
          <h3 className="font-bold text-lg mb-2">Profile Strength</h3>
          <div className="h-2 bg-white/20 rounded-full overflow-hidden mb-2">
            <div className="h-full bg-white w-3/4 rounded-full" />
          </div>
          <p className="text-xs text-blue-100 font-medium">
            Your profile is 75% complete. Add a bio to reach 100%!
          </p>
        </div>
      </div>

      {/* Edit Form */}
      <div className="md:col-span-2 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <form action={formAction} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-1.5 font-semibold">
              <label className="text-sm text-gray-700 flex items-center gap-2">
                <School className="w-4 h-4 text-gray-400" /> Institute
              </label>
              <input
                type="text"
                name="institute"
                required
                defaultValue={initialData?.institute || ""}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all placeholder:text-gray-300"
                placeholder="e.g. Dhaka University"
              />
            </div>

            <div className="space-y-1.5 font-semibold">
              <label className="text-sm text-gray-700 flex items-center gap-2">
                <Book className="w-4 h-4 text-gray-400" /> Class/Year
              </label>
              <input
                type="text"
                name="class"
                required
                defaultValue={initialData?.class || ""}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all placeholder:text-gray-300"
                placeholder="e.g. Class 10 or 2nd Year"
              />
            </div>

            <div className="space-y-1.5 font-semibold">
              <label className="text-sm text-gray-700 flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-400" /> Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                required
                pattern="^(\+88)?01[3-9]\d{8}$"
                title="Enter a valid Bangladeshi phone number (e.g., 01712345678)"
                defaultValue={initialData?.phone || ""}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all placeholder:text-gray-300"
                placeholder="01712345678"
              />
            </div>

            <div className="space-y-1.5 font-semibold">
              <label className="text-sm text-gray-700 flex items-center gap-2">
                <Users className="w-4 h-4 text-gray-400" /> Group/Stream
              </label>
              <select
                name="group"
                defaultValue={initialData?.group || "SCIENCE"}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
              >
                <option value="SCIENCE">Science</option>
                <option value="COMMERCE">Commerce</option>
                <option value="ARTS">Arts</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            <div className="sm:col-span-2 space-y-1.5 font-semibold">
              <label className="text-sm text-gray-700 flex items-center gap-2">
                <Home className="w-4 h-4 text-gray-400" /> Address
              </label>
              <input
                type="text"
                name="address"
                required
                minLength={5}
                title="Address must be at least 5 characters"
                defaultValue={initialData?.address || ""}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all placeholder:text-gray-300"
                placeholder="Your full address (min 5 characters)"
              />
            </div>

            <div className="sm:col-span-2 space-y-1.5 font-semibold">
              <label className="text-sm text-gray-700 flex items-center gap-2">
                <FileText className="w-4 h-4 text-gray-400" /> Bio / Learning
                Goals
              </label>
              <textarea
                name="bio"
                defaultValue={initialData?.bio || ""}
                rows={4}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all placeholder:text-gray-300 resize-none font-medium"
                placeholder="Tell tutors about your learning goals..."
              />
            </div>
          </div>

          <div className="pt-4 border-t border-gray-50">
            <button
              type="submit"
              disabled={isPending}
              className="w-full sm:w-auto px-8 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> Updating...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" /> Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
