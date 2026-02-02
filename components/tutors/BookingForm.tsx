"use client";

import { createBookingWithForm } from "@/actions/student.actions";
import { ActionState } from "@/lib/types";
import {
  Calendar as CalendarIcon,
  CheckCircle,
  Clock,
  Loader2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";

export default function BookingForm({
  tutorId,
  pricePerDay,
  availableFrom,
  availableTo,
}: {
  tutorId: string;
  pricePerDay: number;
  availableFrom: string | null;
  availableTo: string | null;
}) {
  const router = useRouter(); // Keeping router for redirect/navigation if needed on success

  const initialState: ActionState = { success: false };
  const [state, formAction, isPending] = useActionState(
    createBookingWithForm,
    initialState,
  );

  useEffect(() => {
    if (state?.success) {
      toast.success("Booking request sent successfully!");
      // router.push("/student/bookings");
      // If we want to redirect, we can do it here.
      // Or server action could use `redirect` (import from next/navigation) but that throws an error caught by boundary if not handled carefully.
      // Client side redirect on success state is often safer for simple forms.
      router.push("/student/bookings");
    } else if (state?.error) {
      toast.error(state.error);
    }
  }, [state, router]);

  // We can let native date pickers handle state implicitly via form submission.
  // Or keep state if we want complex validation before submit.
  // For simplicity and "clean code", let's trust native constraints + server validation.

  return (
    <div className="sticky top-28 bg-white rounded-3xl p-8 shadow-xl shadow-blue-50 border border-gray-100 text-gray-700">
      <div className="mb-8">
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">
          Tuition Fee
        </p>
        <h2 className="text-4xl font-black text-gray-900">
          BDT {pricePerDay}
          <span className="text-sm font-medium text-gray-400">/day</span>
        </h2>
      </div>

      <form action={formAction} className="space-y-6">
        <input type="hidden" name="tutorId" value={tutorId} />
        <input type="hidden" name="duration" value="2" />{" "}
        {/* Default duration */}
        <div className="space-y-1.5 font-semibold">
          <label className="text-sm flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-blue-600" /> Preferred Date
          </label>
          <input
            type="date"
            name="date"
            required
            min={
              availableFrom
                ? new Date(availableFrom).toISOString().split("T")[0]
                : new Date().toISOString().split("T")[0]
            }
            max={
              availableTo
                ? new Date(availableTo).toISOString().split("T")[0]
                : undefined
            }
            className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
          />
        </div>
        <div className="space-y-1.5 font-semibold">
          <label className="text-sm flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-600" /> Start Time
          </label>
          <input
            type="time"
            name="time"
            required
            className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
          />
        </div>
        <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
          <h4 className="text-blue-900 font-bold text-sm mb-1 flex items-center gap-2">
            <CheckCircle className="w-4 h-4" /> Why book now?
          </h4>
          <p className="text-[11px] text-blue-700 font-medium">
            Session requests are usually confirmed within 12 hours. Pay securely
            after session confirmation.
          </p>
        </div>
        <button
          type="submit"
          disabled={isPending}
          className="w-full py-4 bg-blue-600 text-white font-black rounded-2xl shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isPending ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            "Request Session"
          )}
        </button>
      </form>

      <div className="mt-8 pt-8 border-t border-gray-50 flex items-center gap-4">
        <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center text-green-600 shrink-0">
          <CheckCircle className="w-6 h-6" />
        </div>
        <p className="text-[11px] text-gray-500 font-medium italic">
          Verified Expert | Quality Guaranteed | Safe Learning
        </p>
      </div>
    </div>
  );
}
