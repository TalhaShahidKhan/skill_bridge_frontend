"use client";

import { TutorProfile, Session, Category } from "@/lib/types";
import { User, Mail, Phone, MapPin, School, PencilLine, Briefcase, Star, Clock, Banknote, CheckCircle2, XCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface TutorProfileViewProps {
  profile: TutorProfile | null;
  session: Session | null;
  categories: Category[];
}

export default function TutorProfileView({ profile, session, categories }: TutorProfileViewProps) {
  const user = session?.user;
  const categoryName = categories.find(c => c.categoryId === profile?.categoryId)?.name;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden font-outfit">
      {/* Header/Cover */}
      <div className="h-32 bg-gradient-to-r from-indigo-600 to-purple-700"></div>

      <div className="px-8 pb-8">
        <div className="relative flex flex-col md:flex-row md:items-end -mt-16 mb-6 gap-6">
          <div className="relative w-32 h-32 rounded-2xl overflow-hidden border-4 border-white shadow-lg bg-indigo-50 flex items-center justify-center">
            {profile?.profilePic || user?.image ? (
              <Image
                src={profile?.profilePic || user?.image || ""}
                alt={user?.name || "Profile"}
                fill
                className="object-cover"
                unoptimized
              />
            ) : (
              <User className="w-16 h-16 text-indigo-400" />
            )}
          </div>
          <div className="flex-1 pb-2">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">{user?.name}</h2>
              {profile?.avgRating ? (
                <div className="flex items-center gap-1 px-2 py-1 bg-yellow-50 text-yellow-700 rounded-lg border border-yellow-100 text-sm font-bold">
                  <Star className="w-3.5 h-3.5 fill-yellow-500" />
                  {profile.avgRating.toFixed(1)}
                </div>
              ) : null}
            </div>
            <p className="text-gray-500 font-medium flex items-center gap-2">
              <Mail className="w-4 h-4" /> {user?.email}
            </p>
          </div>
          <Link
            href="/tutor/profile/edit"
            className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-all shadow-sm active:scale-95"
          >
            <PencilLine className="w-4 h-4" />
            Edit Profile
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="md:col-span-2 space-y-8">
            <section>
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Professional Bio</h3>
              <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100 min-h-[100px]">
                {profile?.bio || "No professional bio added yet. Tell potential students about your teaching philosophy!"}
              </p>
            </section>

            <section>
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Subjects & Specialization</h3>
              <div className="flex flex-wrap gap-2">
                {profile?.subjects && profile.subjects.length > 0 ? (
                  profile.subjects.map((subject) => (
                    <span key={subject} className="px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-semibold border border-indigo-100">
                      {subject}
                    </span>
                  ))
                ) : (
                  <p className="text-gray-400 italic">No subjects listed.</p>
                )}
              </div>
            </section>

            <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-gray-100 bg-white hover:border-indigo-200 transition-colors group">
                <div className="flex items-center gap-3 mb-1">
                  <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    <Briefcase className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-gray-400 uppercase">Experience</span>
                </div>
                <p className="font-semibold text-gray-800 ml-10">{profile?.experience ? `${profile.experience} Years` : "Not specified"}</p>
              </div>

              <div className="p-4 rounded-xl border border-gray-100 bg-white hover:border-purple-200 transition-colors group">
                <div className="flex items-center gap-3 mb-1">
                  <div className="p-2 bg-purple-50 rounded-lg text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                    <Banknote className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-gray-400 uppercase">Rate (per day)</span>
                </div>
                <p className="font-semibold text-gray-800 ml-10">{profile?.pricePerDay ? `$${profile.pricePerDay}` : "Not specified"}</p>
              </div>
            </section>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <section className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
              <h3 className="text-sm font-bold text-gray-900 mb-4">Teaching Information</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="p-2 bg-white rounded-lg border border-gray-200 text-gray-400">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <span className="block text-xs font-bold text-gray-400 uppercase">Availability</span>
                    <div className="flex items-center gap-2 mt-0.5">
                      {profile?.isAvailable ? (
                        <span className="flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-100">
                          <CheckCircle2 className="w-3 h-3" /> Available
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full border border-red-100">
                          <XCircle className="w-3 h-3" /> Offline
                        </span>
                      )}
                    </div>
                    {profile?.availableFrom && (
                      <span className="text-xs text-gray-500 mt-1 block">
                        {profile.availableFrom} - {profile.availableTo}
                      </span>
                    )}
                  </div>
                </li>
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
                    <School className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-gray-400 uppercase">Category</span>
                    <span className="font-semibold text-gray-800">{categoryName || "Not specified"}</span>
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
              </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
