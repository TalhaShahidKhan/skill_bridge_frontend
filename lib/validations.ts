import { z } from "zod";

export const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const signUpSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["STUDENT", "TUTOR"]),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const resetPasswordSchema = z
  .object({
    newPassword: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z
      .string()
      .min(6, "Password must be at least 6 characters"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type SignInInput = z.infer<typeof signInSchema>;
export type SignUpInput = z.infer<typeof signUpSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export const studentProfileSchema = z.object({
  class: z.string().min(1, "Class is required"),
  institute: z.string().min(2, "Institute must be at least 2 characters"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  phone: z
    .string()
    .regex(/^(\+88)?01[3-9]\d{8}$/, "Invalid Bangladeshi phone number"),
  bio: z.string().max(500, "Bio must be at most 500 characters").optional(),
  group: z.enum(["SCIENCE", "COMMERCE", "ARTS", "OTHER"]),
});

export const tutorProfileSchema = z.object({
  subjects: z.array(z.string()).min(1, "At least one subject is required"),
  experience: z.coerce.number().min(0, "Experience must be at least 0"),
  address: z.string().min(5, "Address is required"),
  phone: z
    .string()
    .regex(/^(\+88)?01[3-9]\d{8}$/, "Invalid Bangladeshi phone number"),
  bio: z.string().max(1000, "Bio is too long").optional(),
  institute: z.string().optional(),
  group: z.enum(["SCIENCE", "COMMERCE", "ARTS", "OTHER"]),
  categoryId: z.string().min(1, "Category is required"),
  pricePerDay: z.coerce.number().min(1, "Price must be at least 1"),
});

export type StudentProfileInput = z.infer<typeof studentProfileSchema>;
export type TutorProfileInput = z.infer<typeof tutorProfileSchema>;
