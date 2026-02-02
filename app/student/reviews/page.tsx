import StudentReviewsClient from "@/components/student/StudentReviewsClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Reviews | Skill Bridge",
  description:
    "View all the reviews and feedback you have given to your tutors.",
};

export default function ReviewsPage() {
  return <StudentReviewsClient />;
}
