"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function deleteSubCategory(id: number) {

  await prisma.sub_categories.deleteMany({
    where: { SubCategoryID: id }
  })

  revalidatePath("/subcategories")
}