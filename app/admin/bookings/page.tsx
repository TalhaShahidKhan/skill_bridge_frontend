import AdminBookingsClient from "@/components/admin/AdminBookingsClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Booking Management | Admin | Skill Bridge",
  description:
    "Monitor and manage all tutoring sessions and bookings across the Skill Bridge platform.",
};

export default function BookingsPage() {
  return <AdminBookingsClient />;
}
