"use client";

import { updateTutorProfileWithForm } from "@/actions/tutor.actions";
import { ActionState, Category, Session, TutorProfile } from "@/lib/types";
import {
  Book,
  Briefcase,
  CheckCircle,
  DollarSign,
  FileText,
  Home,
  Loader2,
  Phone,
  Save,
  School,
  Tag,
  User,
  Users,
} from "lucide-react";
import Image from "next/image";
import { useActionState, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export default function TutorProfileForm({
  initialData,
  session,
  categories,
}: {
  initialData: TutorProfile | null;
  session: Session | null;
  categories: Category[];
}) {
  const [selectedCategoryId, setSelectedCategoryId] = useState(
    initialData?.categoryId || "",
  );
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(
    initialData?.subjects || [],
  );

  const handleSubjectToggle = (subject: string) => {
    setSelectedSubjects((prev) =>
      prev.includes(subject)
        ? prev.filter((s) => s !== subject)
        : [...prev, subject],
    );
  };

  // We keep group in state only if we need it for controlled-like behavior,
  // but simpler to just let native stick to defaultValue if we don't need dynamic UI based on group.
  // Actually, let's just rely on native inputs where possible.

  const initialState: ActionState = { success: false };
  const [state, formAction, isPending] = useActionState(
    updateTutorProfileWithForm,
    initialState,
  );

  useEffect(() => {
    if (state?.success) {
      toast.success("Tutor profile updated successfully!");
      // Trigger refresh if needed, though action handles revalidation.
      // router.refresh() is redundant if action revalidates path,
      // but harmless for client-side state sync if needed.
      // Although simpler to just rely on revalidation.
    } else if (state?.error) {
      toast.error(state.error);
    }
  }, [state]);

  // Track the previous categoryId to detect changes from parent
  const prevCategoryIdRef = useRef(initialData?.categoryId);

  // Sync category state if initialData changes (e.g. after revalidation)
  // Using a ref comparison to update state when props change avoids
  // the cascading render anti-pattern
  if (initialData?.categoryId !== prevCategoryIdRef.current) {
    prevCategoryIdRef.current = initialData?.categoryId;
    setSelectedCategoryId(initialData?.categoryId || "");
    setSelectedSubjects(initialData?.subjects || []);
  }

  // Effect to clear selected subjects if category changes (user manual change)
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    // Only reset if it's a manual user change (not initial load/sync)
    // Actually, simple way: if category changes, let user re-select.
  }, [selectedCategoryId]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* ... Profile Card Section (Unchanged) ... */}
      <div className="md:col-span-1 space-y-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
          {/* ... (Same Image/User code) ... */}
          <div className="w-24 h-24 bg-indigo-100 rounded-full mx-auto mb-4 flex items-center justify-center border-4 border-white shadow-md overflow-hidden relative">
            {session?.user.image ? (
              <Image
                src={session.user.image}
                alt=""
                fill
                className="object-cover"
              />
            ) : (
              <User className="w-12 h-12 text-indigo-600" />
            )}
          </div>
          <h2 className="text-xl font-bold text-gray-800 tracking-tight">
            {session?.user.name}
          </h2>
          <p className="text-sm text-gray-500 font-semibold mb-4">
            {session?.user.email}
          </p>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-black uppercase tracking-wider border border-indigo-100">
            <CheckCircle className="w-3 h-3" /> Certified Tutor
          </div>
        </div>
      </div>

      <div className="md:col-span-2 bg-white p-8 rounded-2xl shadow-sm border border-gray-100 font-semibold text-gray-700">
        <form action={formAction} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-sm flex items-center gap-2">
                <Tag className="w-4 h-4 text-gray-400" /> Category
              </label>
              <select
                name="categoryId"
                required
                value={selectedCategoryId}
                onChange={(e) => {
                  setSelectedCategoryId(e.target.value);
                  setSelectedSubjects([]); // Reset subjects on category change
                }}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all"
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat.categoryId} value={cat.categoryId}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2 space-y-3">
              <label className="text-sm flex items-center gap-2 mb-1">
                <Book className="w-4 h-4 text-gray-400" /> Select Subjects
              </label>

              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 min-h-[100px]">
                {(() => {
                  const selectedCategory = categories.find(
                    (c) => c.categoryId === selectedCategoryId,
                  );
                  const subjects = selectedCategory?.subjects || [];

                  if (!selectedCategoryId) {
                    return (
                      <p className="text-xs text-gray-400 italic">
                        Select a category first to see available subjects.
                      </p>
                    );
                  }

                  if (subjects.length === 0) {
                    return (
                      <div className="space-y-2">
                        <p className="text-xs text-gray-500 mb-2">
                          Add custom subjects for this category:
                        </p>
                        <input
                          type="text"
                          placeholder="Type subject and press Enter (dummy for now)"
                          className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              const val = e.currentTarget.value.trim();
                              if (val && !selectedSubjects.includes(val)) {
                                setSelectedSubjects([...selectedSubjects, val]);
                                e.currentTarget.value = "";
                              }
                            }
                          }}
                        />
                        <div className="flex flex-wrap gap-2 mt-2">
                          {selectedSubjects.map((s) => (
                            <span
                              key={s}
                              className="px-3 py-1 bg-indigo-600 text-white text-xs rounded-full flex items-center gap-2"
                            >
                              {s}
                              <button
                                type="button"
                                onClick={() => handleSubjectToggle(s)}
                                className="hover:text-red-200"
                              >
                                ×
                              </button>
                              <input type="hidden" name="subjects" value={s} />
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {subjects.map((subject) => (
                        <label
                          key={subject}
                          className={`flex items-center gap-2 p-3 rounded-xl border transition-all cursor-pointer group ${
                            selectedSubjects.includes(subject)
                              ? "bg-indigo-50 border-indigo-200 text-indigo-700 shadow-sm"
                              : "bg-white border-gray-100 hover:border-indigo-100 hover:bg-gray-50"
                          }`}
                        >
                          <div
                            className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                              selectedSubjects.includes(subject)
                                ? "bg-indigo-600 border-indigo-600"
                                : "border-gray-300 bg-white group-hover:border-indigo-400"
                            }`}
                          >
                            {selectedSubjects.includes(subject) && (
                              <div className="w-1.5 h-1.5 bg-white rounded-full" />
                            )}
                          </div>
                          <input
                            type="checkbox"
                            name="subjects"
                            value={subject}
                            checked={selectedSubjects.includes(subject)}
                            onChange={() => handleSubjectToggle(subject)}
                            className="hidden"
                          />
                          <span className="text-xs font-bold truncate">
                            {subject}
                          </span>
                        </label>
                      ))}
                    </div>
                  );
                })()}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-gray-400" /> Experience
                (Years)
              </label>
              <input
                type="number"
                name="experience"
                required
                defaultValue={initialData?.experience ?? 0}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-gray-400" /> Price Per Day
                (BDT)
              </label>
              <input
                type="number"
                name="pricePerDay"
                required
                defaultValue={initialData?.pricePerDay ?? 0}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-400" /> Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                required
                pattern="^(\+88)?01[3-9]\d{8}$"
                title="Enter a valid Bangladeshi phone number (e.g., 01712345678)"
                defaultValue={initialData?.phone || ""}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all"
                placeholder="01712345678"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm flex items-center gap-2">
                <Users className="w-4 h-4 text-gray-400" /> Student Group
              </label>
              <select
                name="group"
                defaultValue={initialData?.group || "SCIENCE"}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all"
              >
                <option value="SCIENCE">Science</option>
                <option value="COMMERCE">Commerce</option>
                <option value="ARTS">Arts</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-sm flex items-center gap-2">
                <School className="w-4 h-4 text-gray-400" /> Current Institute
              </label>
              <input
                type="text"
                name="institute"
                defaultValue={initialData?.institute || ""}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all"
                placeholder="e.g. BUET"
              />
            </div>

            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-sm flex items-center gap-2">
                <Home className="w-4 h-4 text-gray-400" /> Teaching Address
              </label>
              <input
                type="text"
                name="address"
                required
                minLength={5}
                title="Address must be at least 5 characters"
                defaultValue={initialData?.address || ""}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all"
                placeholder="Enter your teaching address"
              />
            </div>

            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-sm flex items-center gap-2">
                <FileText className="w-4 h-4 text-gray-400" /> Teaching Bio /
                Philosophy
              </label>
              <textarea
                name="bio"
                defaultValue={initialData?.bio || ""}
                rows={4}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all resize-none font-medium"
                placeholder="Tell students about your teaching methodology..."
              />
            </div>
          </div>

          <div className="pt-4 border-t border-gray-50">
            <button
              type="submit"
              disabled={isPending}
              className="w-full sm:w-auto px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> Updating...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" /> Save Profile
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
