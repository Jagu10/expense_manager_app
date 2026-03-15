"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { getSession } from "@/lib/auth";

const categorySchema = z.object({
  categoryName: z.string().min(1, "Category name is required"),
  isExpense: z.boolean(),
  isIncome: z.boolean(),
}).refine(data => data.isExpense || data.isIncome, "Select at least Expense or Income");

export async function AddCategoriesAction(formData: FormData) {
  const categoryName = formData.get("categoryName") as string;
  const logoPath = formData.get("logoPath") as string | null;
  const description = formData.get("description") as string | null;

  const type = formData.get("type") as string;
  const isExpense = type === "expense";
  const isIncome = type === "income";
  const isActive = formData.get("isActive") === "on";

  const sequenceRaw = formData.get("sequence");
  const sequence = sequenceRaw ? Number(sequenceRaw) : null;

  const session = await getSession();
  const userId = session?.user?.id || 1;

  const parsed = categorySchema.safeParse({ categoryName, isExpense, isIncome });
  if (!parsed.success) {
    throw new Error(parsed.error.message);
  }

  await prisma.categories.create({
    data: {
      CategoryName: categoryName,
      LogoPath: logoPath,
      IsExpense: isExpense,
      IsIncome: isIncome,
      IsActive: isActive ?? true,
      Description: description,
      Sequence: sequence,
      UserID: session?.user?.adminId || 1,
      Created: new Date(),
      Modified: new Date(),
    },
  });

  revalidatePath("/categories");
  redirect("/categories");
}
