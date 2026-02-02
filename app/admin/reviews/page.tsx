import AdminReviewsClient from "@/components/admin/AdminReviewsClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Review Moderation | Admin | Skill Bridge",
  description:
    "Maintain community standards by moderating student reviews and feedback.",
};

export default function ReviewsPage() {
  return <AdminReviewsClient />;
}
