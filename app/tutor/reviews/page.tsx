import TutorReviewsClient from "@/components/tutor/TutorReviewsClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tutor Reviews | Skill Bridge",
  description: "View all the feedback and ratings received from your students.",
};

export default function ReviewsPage() {
  return <TutorReviewsClient />;
}
