"use client";

import { markSessionCompleteAction } from "@/actions/tutor.actions";
import { Calendar, CheckCircle, Clock, Users, XCircle } from "lucide-react";
import Image from "next/image";
import { useTransition } from "react";
import { toast } from "sonner";

interface Session {
  id: string;
  status: string;
  date: string;
  time: string;
  duration: number;
  student?: {
    user?: {
      name: string;
      image?: string | null;
    };
  };
}

export default function SessionList({ sessions }: { sessions: Session[] }) {
  const [isPending, startTransition] = useTransition();

  const handleMarkCompleted = async (id: string) => {
    startTransition(async () => {
      const res = await markSessionCompleteAction(id);
      if (res?.error) {
        toast.error(res.error || "Failed to update session");
      } else {
        toast.success("Session marked as completed!");
      }
    });
  };

  if (sessions.length === 0) {
    return (
      <div className="p-20 text-center">
        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <Calendar className="w-10 h-10 text-gray-300" />
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">
          No sessions found
        </h2>
        <p className="text-gray-500 font-medium mb-6 max-w-xs mx-auto">
          You don&apos;t have any sessions matching this filter.
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-100">
      {sessions.map((session) => (
        <div
          key={session.id}
          className={`p-6 hover:bg-gray-50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-6 group ${isPending ? "opacity-50" : ""}`}
        >
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-indigo-100 rounded-2xl shrink-0 flex items-center justify-center overflow-hidden border-2 border-white shadow-sm relative">
              {session.student?.user?.image ? (
                <Image
                  src={session.student.user.image}
                  alt=""
                  fill
                  className="object-cover"
                />
              ) : (
                <Users className="w-8 h-8 text-indigo-600" />
              )}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg text-gray-800 tracking-tight">
                  {session.student?.user?.name || "Student"}
                </h3>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-tighter border ${
                    session.status === "COMPLETED"
                      ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                      : session.status === "CANCELLED"
                        ? "bg-rose-100 text-rose-700 border-rose-200"
                        : "bg-indigo-100 text-indigo-700 border-indigo-200"
                  }`}
                >
                  {session.status}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 font-semibold mt-2">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-gray-400" />{" "}
                  {new Date(session.date).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-gray-400" />{" "}
                  {new Date(session.time).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}{" "}
                  ({session.duration}h)
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {session.status === "CONFIRMED" && (
              <button
                onClick={() => handleMarkCompleted(session.id)}
                disabled={isPending}
                className="px-4 py-2 bg-indigo-600 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center gap-2 active:scale-95"
              >
                <CheckCircle className="w-4 h-4" /> Mark Completed
              </button>
            )}
            {session.status === "CONFIRMED" && (
              <button
                disabled={isPending}
                className="px-4 py-2 text-rose-600 font-bold text-sm border-2 border-rose-50 hover:bg-rose-50 rounded-xl transition-all flex items-center gap-2 active:scale-95"
              >
                <XCircle className="w-4 h-4" /> Cancel
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
