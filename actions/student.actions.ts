"use server";

import { studentApi } from "@/api/student";
import { StudentProfile } from "@/lib/types";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

async function getAuthHeaders() {
  const h = await headers();
  return {
    cookie: h.get("cookie") || "",
  };
}

export async function browseTutorsAction(query: {
  search?: string;
  category?: string;
  page?: number;
  limit?: number;
}) {
  return studentApi.browseTutors(query);
}

export async function getTutorDetailsAction(id: string) {
  return studentApi.getTutorDetails(id);
}

export async function createBookingAction(data: {
  tutorId: string;
  date: Date;
  time: Date;
  duration: number;
}) {
  const h = await getAuthHeaders();
  const res = await studentApi.createBooking(data, h);
  revalidatePath("/student/bookings");
  revalidatePath("/student");
  return res;
}

export async function createBookingWithForm(
  prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const rawData = {
      tutorId: formData.get("tutorId") as string,
      date: new Date(formData.get("date") as string),
      time: new Date(`${formData.get("date")}T${formData.get("time")}`),
      duration: Number(formData.get("duration") || 2),
    };

    const h = await getAuthHeaders();
    const res = await studentApi.createBooking(rawData, h);

    if (res.error) {
      return { success: false, error: res.error };
    }

    revalidatePath("/student/bookings");
    revalidatePath("/student");
    return { success: true, data: res.data };
  } catch {
    return { success: false, error: "Failed to create booking" };
  }
}

// ... other actions

import { studentProfileSchema } from "@/lib/validations";
import { ZodError } from "zod";

// Action state type for form actions
export type ActionState = {
  success: boolean;
  error?: string;
  data?: unknown;
};

export async function updateStudentProfileAction(
  data: Partial<StudentProfile>,
) {
  const h = await getAuthHeaders();
  const res = await studentApi.updateProfile(data, h);
  revalidatePath("/student/profile");
  return res;
}

export async function updateStudentProfileWithForm(
  prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const rawData = Object.fromEntries(formData.entries());

    // Convert empty strings to undefined for optional fields
    const cleanedData = {
      ...rawData,
      bio: rawData.bio || undefined,
    };

    const validated = studentProfileSchema.parse(cleanedData);

    const h = await getAuthHeaders();
    const res = await studentApi.upsertProfile(validated, h);

    if (res.error) {
      return { success: false, error: res.error };
    }

    revalidatePath("/student/profile");
    revalidatePath("/student");
    return { success: true, data: res.data };
  } catch (err) {
    if (err instanceof ZodError) {
      // Join all validation errors for better UX
      const messages = err.issues.map((issue) => issue.message).join(", ");
      return { success: false, error: messages };
    }
    return { success: false, error: "An unexpected error occurred" };
  }
}

export async function cancelBookingAction(id: string) {
  const h = await getAuthHeaders();
  const res = await studentApi.cancelBooking(id, h);
  revalidatePath("/student/bookings");
  revalidatePath("/student");
  return res;
}

// Backend expects { bookingId, rating, comment }
export async function createReviewAction(data: {
  bookingId: string;
  rating: number;
  comment?: string;
}) {
  const h = await getAuthHeaders();
  const res = await studentApi.createReview(data, h);
  revalidatePath("/student/reviews");
  revalidatePath("/student/bookings");
  revalidatePath("/tutors");
  return res;
}

export async function createReviewWithForm(
  prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const data = {
      bookingId: formData.get("bookingId") as string,
      rating: Number(formData.get("rating")),
      comment: (formData.get("comment") as string) || undefined,
    };

    if (!data.bookingId || !data.rating) {
      return { success: false, error: "Booking ID and rating are required" };
    }

    if (data.rating < 1 || data.rating > 5) {
      return { success: false, error: "Rating must be between 1 and 5" };
    }

    const h = await getAuthHeaders();
    const res = await studentApi.createReview(data, h);

    if (res.error) {
      return { success: false, error: res.error };
    }

    revalidatePath("/student/reviews");
    revalidatePath("/student/bookings");
    revalidatePath("/tutors");
    return { success: true, data: res.data };
  } catch {
    return { success: false, error: "Failed to create review" };
  }
}
