"use server";

import { tutorApi } from "@/api/tutor";
import { ActionState, TutorProfile } from "@/lib/types";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

async function getAuthHeaders() {
  const h = await headers();
  return {
    cookie: h.get("cookie") || "",
  };
}

import { tutorProfileSchema } from "@/lib/validations";
import { ZodError } from "zod";

export async function updateTutorProfileAction(data: Partial<TutorProfile>) {
  const h = await getAuthHeaders();
  const res = await tutorApi.updateProfile(data, h);
  revalidatePath("/tutor/profile");
  revalidatePath("/tutor");
  return res;
}

export async function updateTutorProfileWithForm(
  prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const subjects = formData.getAll("subjects") as string[];
    const categoryId = formData.get("categoryId") as string;
    const experience = Number(formData.get("experience"));
    const pricePerDay = Number(formData.get("pricePerDay"));
    const phone = formData.get("phone") as string;
    const address = formData.get("address") as string;
    const bio = (formData.get("bio") as string) || undefined;
    const institute = (formData.get("institute") as string) || undefined;
    const group = formData.get("group") as string;

    const cleanedData = {
      subjects,
      categoryId,
      experience,
      pricePerDay,
      phone,
      address,
      bio,
      institute,
      group,
    };

    const validated = tutorProfileSchema.parse(cleanedData);

    const h = await getAuthHeaders();
    const res = await tutorApi.upsertProfile(
      validated as unknown as Partial<TutorProfile>,
      h,
    );

    if (res.error) {
      return { success: false, error: res.error };
    }

    revalidatePath("/tutor/profile");
    revalidatePath("/tutor");
    return { success: true, data: res.data };
  } catch (err) {
    console.error("[TutorAction] Exception:", err);
    if (err instanceof ZodError) {
      // Join all validation errors for better UX
      const messages = err.issues.map((issue) => issue.message).join(", ");
      return { success: false, error: messages };
    }
    return { success: false, error: "An unexpected error occurred" };
  }
}

export async function setTutorAvailabilityAction(data: {
  availableFrom: string;
  availableTo: string;
  isAvailable: boolean;
}) {
  const h = await getAuthHeaders();
  const res = await tutorApi.setAvailability(data, h);
  revalidatePath("/tutor");
  return res;
}

export async function setTutorAvailabilityWithForm(
  prevState: ActionState,
  formData: FormData,
) {
  try {
    const rawData = {
      availableFrom: formData.get("availableFrom") as string,
      availableTo: formData.get("availableTo") as string,
      isAvailable: formData.get("isAvailable") === "true",
    };

    const h = await getAuthHeaders();
    const res = await tutorApi.setAvailability(rawData, h);

    if (res.error) {
      return { success: false, error: res.error };
    }

    revalidatePath("/tutor");
    return { success: true };
  } catch {
    return { success: false, error: "An unexpected error occurred" };
  }
}

export async function markSessionCompleteAction(id: string) {
  const h = await getAuthHeaders();
  const res = await tutorApi.markSessionComplete(id, h);
  revalidatePath("/tutor/sessions");
  revalidatePath("/tutor");
  return res;
}

export async function markSessionCompleteWithForm(
  prevState: ActionState,
  formData: FormData,
) {
  const id = formData.get("bookingId") as string;
  const h = await getAuthHeaders();
  const res = await tutorApi.markSessionComplete(id, h);
  revalidatePath("/tutor/sessions");
  revalidatePath("/tutor");
  if (res.error) return { success: false, error: res.error };
  return { success: true };
}

export async function listTutorSessionsAction(query: {
  status?: string;
  page?: number;
  limit?: number;
}) {
  const h = await getAuthHeaders();
  return tutorApi.listSessions(query, h);
}
