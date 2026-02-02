import { studentApi } from "@/api/student";
import CategoryManager from "@/components/admin/CategoryManager";
import { Category } from "@/lib/types";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Category Management | Admin | Skill Bridge",
  description:
    "Organize tutoring subjects and master categories on the platform.",
};

import { headers } from "next/headers";

export default async function CategoriesPage() {
  const h = await headers();
  const { data: categories } = await studentApi.listCategories({
    cookie: h.get("cookie") || "",
  });

  return (
    <CategoryManager categories={(categories as unknown as Category[]) || []} />
  );
}
