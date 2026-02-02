"use client";

import { authClient } from "@/api/betterAuth";
import { AlertTriangle, Loader2, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function DeleteAccountSection() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const router = useRouter();

  const handleDelete = async () => {
    if (confirmText !== "DELETE") return;

    setIsDeleting(true);
    try {
      const { error } = await authClient.deleteUser();
      if (error) {
        toast.error(error.message || "Failed to delete account");
      } else {
        toast.success("Account deleted successfully");
        router.push("/auth/signup");
      }
    } catch {
      toast.error("An unexpected error occurred");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-red-100 overflow-hidden mt-8">
      <div className="p-6 sm:p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center text-red-600 shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Danger Zone</h2>
            <p className="text-sm text-gray-500 font-medium">
              Irreversible actions for your account.
            </p>
          </div>
        </div>

        {!isOpen ? (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-red-50/50 rounded-xl border border-red-100">
            <div>
              <h3 className="text-red-900 font-bold">Delete Account</h3>
              <p className="text-xs text-red-700 font-medium mt-0.5">
                Once you delete your account, there is no going back. Please be
                certain.
              </p>
            </div>
            <button
              onClick={() => setIsOpen(true)}
              className="px-6 py-2.5 bg-red-600 text-white font-black rounded-xl text-sm hover:bg-red-700 transition-all active:scale-95 flex items-center justify-center gap-2 shrink-0"
            >
              <Trash2 className="w-4 h-4" /> Delete Account
            </button>
          </div>
        ) : (
          <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="p-4 bg-red-50 rounded-xl border border-red-200">
              <p className="text-sm text-red-900 font-bold mb-3">
                Are you absolutely sure?
              </p>
              <p className="text-xs text-red-700 font-medium mb-4 leading-relaxed">
                This action will permanently delete your profile, bookings,
                reviews, and all associated data. To confirm, type{" "}
                <span className="font-black underline italic">DELETE</span>{" "}
                below.
              </p>

              <div className="space-y-4">
                <input
                  type="text"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  placeholder="Type DELETE to confirm"
                  className="w-full px-4 py-2.5 bg-white border border-red-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none transition-all font-black text-red-600 placeholder:text-red-200"
                />

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleDelete}
                    disabled={confirmText !== "DELETE" || isDeleting}
                    className="flex-1 px-6 py-3 bg-red-600 text-white font-black rounded-xl text-sm hover:bg-red-700 transition-all active:scale-95 disabled:opacity-50 disabled:grayscale flex items-center justify-center gap-2 shadow-lg shadow-red-100"
                  >
                    {isDeleting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                    Confirm Deletion
                  </button>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      setConfirmText("");
                    }}
                    disabled={isDeleting}
                    className="flex-1 px-6 py-3 bg-white text-gray-700 font-black rounded-xl text-sm border border-gray-200 hover:bg-gray-50 transition-all active:scale-95"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
