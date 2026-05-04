"use client";

import { StudentProfile, Session } from "@/lib/types";
import { User, Mail, Phone, MapPin, School, GraduationCap, PencilLine, Briefcase } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface StudentProfileViewProps {
  profile: StudentProfile | null;
  session: Session | null;
}

export default function StudentProfileView({ profile, session }: StudentProfileViewProps) {
  const user = session?.user;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden font-outfit">
      {/* Header/Cover Placeholder */}
      <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-700"></div>

      <div className="px-8 pb-8">
        <div className="relative flex flex-col md:flex-row md:items-end -mt-16 mb-6 gap-6">
          <div className="relative w-32 h-32 rounded-2xl overflow-hidden border-4 border-white shadow-lg bg-blue-50 flex items-center justify-center">
            {profile?.profilePic || user?.image ? (
              <Image
                src={profile?.profilePic || user?.image || ""}
                alt={user?.name || "Profile"}
                fill
                className="object-cover"
                unoptimized
              />
            ) : (
              <User className="w-16 h-16 text-blue-400" />
            )}
          </div>
          <div className="flex-1 pb-2">
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">{user?.name}</h2>
            <p className="text-gray-500 font-medium flex items-center gap-2">
              <Mail className="w-4 h-4" /> {user?.email}
            </p>
          </div>
          <Link
            href="/student/profile/edit"
            className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-all shadow-sm active:scale-95"
          >
            <PencilLine className="w-4 h-4" />
            Edit Profile
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column: Bio & Details */}
          <div className="md:col-span-2 space-y-8">
            <section>
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">About Me</h3>
              <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100 min-h-[100px]">
                {profile?.bio || "No bio added yet. Tell tutors a bit about your goals and interests!"}
              </p>
            </section>

            <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-gray-100 bg-white hover:border-blue-200 transition-colors group">
                <div className="flex items-center gap-3 mb-1">
                  <div className="p-2 bg-blue-50 rounded-lg text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-gray-400 uppercase">Class/Level</span>
                </div>
                <p className="font-semibold text-gray-800 ml-10">{profile?.class || "Not specified"}</p>
              </div>

              <div className="p-4 rounded-xl border border-gray-100 bg-white hover:border-indigo-200 transition-colors group">
                <div className="flex items-center gap-3 mb-1">
                  <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    <Briefcase className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-gray-400 uppercase">Academic Group</span>
                </div>
                <p className="font-semibold text-gray-800 ml-10">{profile?.group || "Not specified"}</p>
              </div>
            </section>
          </div>

          {/* Right Column: Contact & Location */}
          <div className="space-y-6">
            <section className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
              <h3 className="text-sm font-bold text-gray-900 mb-4">Contact Information</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="p-2 bg-white rounded-lg border border-gray-200 text-gray-400">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-gray-400 uppercase">Phone</span>
                    <span className="font-semibold text-gray-800">{profile?.phone || "Not added"}</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="p-2 bg-white rounded-lg border border-gray-200 text-gray-400">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-gray-400 uppercase">Address</span>
                    <span className="font-semibold text-gray-800">{profile?.address || "Not added"}</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="p-2 bg-white rounded-lg border border-gray-200 text-gray-400">
                    <School className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-gray-400 uppercase">Institute</span>
                    <span className="font-semibold text-gray-800">{profile?.institute || "Not added"}</span>
                  </div>
                </li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
