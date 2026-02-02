"use client";

import {
  activateUserAction,
  deleteUserAction,
  suspendUserAction,
} from "@/actions/admin.actions";
import { User } from "@/lib/types";
import { Ban, CheckCircle, Trash2, UserCheck, UserX } from "lucide-react";
import Image from "next/image";
import { useTransition } from "react";
import { toast } from "sonner";

export default function UsersTable({ users }: { users: User[] }) {
  const [isPending, startTransition] = useTransition();
  const handleAction = async (
    userId: string,
    action: "suspend" | "activate" | "delete",
  ) => {
    if (!confirm(`Are you sure you want to ${action} this user?`)) return;

    startTransition(async () => {
      try {
        let res;
        if (action === "suspend") res = await suspendUserAction(userId);
        if (action === "activate") res = await activateUserAction(userId);
        if (action === "delete") res = await deleteUserAction(userId);

        if (res?.error) {
          toast.error(res.error || `Failed to ${action} user`);
        } else {
          toast.success(`User ${action}d successfully`);
        }
      } catch {
        toast.error("An unexpected error occurred");
      }
    });
  };

  const roleColors = {
    ADMIN: "bg-purple-100 text-purple-700 border-purple-200",
    TUTOR: "bg-blue-100 text-blue-700 border-blue-200",
    STUDENT: "bg-emerald-100 text-emerald-700 border-emerald-200",
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200">
            <th className="px-6 py-4 font-bold text-slate-500 text-xs uppercase tracking-wider">
              User
            </th>
            <th className="px-6 py-4 font-bold text-slate-500 text-xs uppercase tracking-wider">
              Role
            </th>
            <th className="px-6 py-4 font-bold text-slate-500 text-xs uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-4 font-bold text-slate-500 text-xs uppercase tracking-wider">
              Joined
            </th>
            <th className="px-6 py-4 font-bold text-slate-500 text-xs uppercase tracking-wider text-right">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {users.length > 0 ? (
            users.map((user) => (
              <tr
                key={user.id}
                className={`hover:bg-slate-50/50 transition-colors ${isPending ? "opacity-50" : ""}`}
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-100 overflow-hidden relative border border-slate-200">
                      {user.image ? (
                        <Image
                          src={user.image}
                          alt=""
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold">
                          {user.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{user.name}</p>
                      <p className="text-sm text-slate-500 font-medium">
                        {user.email}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wide border ${roleColors[user.role]}`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {user.status === "SUSPENDED" ? (
                    <div className="flex items-center gap-1.5 text-red-600 font-bold text-sm">
                      <Ban className="w-4 h-4" /> Suspended
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-sm">
                      <CheckCircle className="w-4 h-4" /> Active
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-slate-500 font-semibold">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {user.status === "SUSPENDED" ? (
                      <button
                        onClick={() => handleAction(user.id, "activate")}
                        className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                        title="Activate User"
                        disabled={isPending}
                      >
                        <UserCheck className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        onClick={() => handleAction(user.id, "suspend")}
                        className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                        title="Suspend User"
                        disabled={isPending}
                      >
                        <UserX className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => handleAction(user.id, "delete")}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete User"
                      disabled={isPending}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={5}
                className="px-6 py-12 text-center text-slate-500 font-medium"
              >
                No users found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
