"use server"

import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { z } from "zod";

import { getSession } from "@/lib/auth";

const subCategorySchema = z.object({
  name: z.string().min(1, "Subcategory name is required"),
  categoryId: z.number().positive("Valid Category ID is required"),
});

export async function createSubCategory(formData: FormData) {

  const name = formData.get("name") as string
  const categoryId = Number(formData.get("categoryId"))
  const type = formData.get("type") as string

  const session = await getSession();
  const userId = session?.user?.id || 1;

  const parsed = subCategorySchema.safeParse({ name, categoryId });
  if (!parsed.success) {
    throw new Error(parsed.error.message);
  }

  await prisma.sub_categories.create({
    data: {
      SubCategoryName: name,
      CategoryID: categoryId,
      IsExpense: type === "expense",
      IsIncome: type === "income",
      IsActive: true,
      UserID: session?.user?.adminId || 1,
      Created: new Date(),
      Modified: new Date(),
    },
  })

  revalidatePath("/subcategories")
  redirect("/subcategories")
}