"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function DeleteCategoryAction(id: number) {
  if (!id) throw new Error("Invalid Category ID");

  await prisma.categories.deleteMany({
    where: {
      CategoryID: id,
    },
  });

  revalidatePath("/categories");
}
