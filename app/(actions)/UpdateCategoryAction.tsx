"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function UpdateCategoryAction(formData: FormData) {
  const id = Number(formData.get("CategoryID"));

  const categoryName = formData.get("categoryName") as string;
  const logoPath = formData.get("logoPath") as string | null;
  const description = formData.get("description") as string | null;

  const type = formData.get("type") as string;
  const isExpense = type === "expense";
  const isIncome = type === "income";
  const isActive = formData.get("isActive") === "on";

  const sequenceRaw = formData.get("sequence");
  const sequence = sequenceRaw ? Number(sequenceRaw) : null;

  if (!id) throw new Error("Invalid ID");

  await prisma.categories.update({
    where: {
      CategoryID: id,
    },
    data: {
      CategoryName: categoryName,
      LogoPath: logoPath,
      Description: description,
      IsExpense: isExpense,
      IsIncome: isIncome,
      IsActive: isActive,
      Sequence: sequence,
      Modified: new Date(),
    },
  });

  revalidatePath("/categories");
  redirect("/categories");
}
