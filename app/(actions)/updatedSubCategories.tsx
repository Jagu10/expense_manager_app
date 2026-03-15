"use server";

import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

export async function updateSubCategory(formData: FormData) {
  const id = Number(formData.get("id"))
  const name = formData.get("name") as string
  const type = formData.get("type") as string
  const categoryId = Number(formData.get("categoryId"))
  const isActive = formData.get("isActive") === "on";

  await prisma.sub_categories.update({
    where: { SubCategoryID: id },
    data: {
      SubCategoryName: name,
      CategoryID: categoryId,
      IsExpense: type === "expense",
      IsIncome: type === "income",
      IsActive: isActive,
      Modified: new Date()
    }
  })

  revalidatePath("/subcategories")
  redirect("/subcategories")
}