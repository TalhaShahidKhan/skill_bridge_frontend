"use client";

import { setTutorAvailabilityWithForm } from "@/actions/tutor.actions";
import { AlertCircle, Calendar, Loader2, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";

export default function AvailabilityForm({
  initialData,
}: {
  initialData: {
    availableFrom: string;
    availableTo: string;
    isAvailable: boolean;
  } | null;
}) {
  const router = useRouter(); // Keeping router if you needed it for anything else, otherwise remove. Actually redundant with server revalidate, but okay to keep for now if needed.
  // Actually, let's keep things clean and rely on state updates or revalidation.
  // But for checkboxes/toggles in form actions, we often need some JS to flip a visual state or a hidden input.

  const [isAvailable, setIsAvailable] = useState(
    initialData?.isAvailable ?? true,
  );

  const [state, formAction, isPending] = useActionState(
    setTutorAvailabilityWithForm,
    { success: false },
  );

  useEffect(() => {
    if (state?.success) {
      toast.success("Availability updated successfully!");
    } else if (state?.error) {
      toast.error(state.error);
    }
  }, [state]);

  // Sync state if initialData changes
  useEffect(() => {
    if (initialData) {
      setIsAvailable(initialData.isAvailable ?? true);
    }
  }, [initialData]);

  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 font-semibold text-gray-700">
      <form action={formAction} className="space-y-8">
        <div className="flex items-center justify-between p-4 bg-indigo-50 rounded-xl border border-indigo-100">
          <div className="flex items-center gap-3">
            <div
              className={`w-3 h-3 rounded-full ${isAvailable ? "bg-emerald-500" : "bg-gray-300"}`}
            />
            <div>
              <h3 className="text-indigo-900 leading-tight">
                Accepting New Students
              </h3>
              <p className="text-xs text-indigo-700 font-medium">
                Toggle your status in the search results
              </p>
            </div>
          </div>
          {/* Hidden input to submit the boolean value */}
          <input type="hidden" name="isAvailable" value={String(isAvailable)} />
          <button
            type="button"
            onClick={() => setIsAvailable(!isAvailable)}
            className={`w-12 h-6 rounded-full transition-colors relative ${isAvailable ? "bg-indigo-600" : "bg-gray-300"}`}
          >
            <div
              className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isAvailable ? "left-7" : "left-1"}`}
            />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="text-sm flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-400" /> Available From
            </label>
            <input
              type="date"
              name="availableFrom"
              required
              defaultValue={
                initialData?.availableFrom
                  ? new Date(initialData.availableFrom)
                      .toISOString()
                      .split("T")[0]
                  : ""
              }
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-400" /> Available Until
            </label>
            <input
              type="date"
              name="availableTo"
              required
              defaultValue={
                initialData?.availableTo
                  ? new Date(initialData.availableTo)
                      .toISOString()
                      .split("T")[0]
                  : ""
              }
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all"
            />
          </div>
        </div>

        <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 flex items-start gap-4">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-sm text-amber-700 font-medium">
            Students will only be able to book you within this date range. You
            can always update this as your schedule changes.
          </p>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isPending ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" /> Saving...
            </>
          ) : (
            <>
              <Save className="w-5 h-5" /> Save Availability
            </>
          )}
        </button>
      </form>
    </div>
  );
}
