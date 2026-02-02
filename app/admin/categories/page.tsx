import { studentApi } from "@/api/student";
import CategoryManager from "@/components/admin/CategoryManager";
import { Category } from "@/lib/types";

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
