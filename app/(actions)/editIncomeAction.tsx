"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function updateIncomeAction(formData: FormData) {
  const incomeId = Number(formData.get("incomeId"));
  const incomeDate = formData.get("incomeDate") as string;
  const categoryIdRaw = formData.get("categoryId");
  const subCategoryIdRaw = formData.get("subCategoryId");
  const projectIdRaw = formData.get("projectId");
  const peopleIdRaw = formData.get("peopleId");
  const amount = Number(formData.get("amount"));
  const description = formData.get("description") as string;

  const categoryId = categoryIdRaw ? Number(categoryIdRaw) : null;
  const subCategoryId = subCategoryIdRaw ? Number(subCategoryIdRaw) : null;
  const projectId = projectIdRaw ? Number(projectIdRaw) : null;
  const peopleId = peopleIdRaw ? Number(peopleIdRaw) : 0;

  if (!incomeId) {
    throw new Error("Invalid Income ID");
  }

  await prisma.incomes.update({
    where: { IncomeID: incomeId },
    data: {
      IncomeDate: new Date(incomeDate),
      CategoryID: categoryId,
      SubCategoryID: subCategoryId,
      ProjectID: projectId,
      PeopleID: peopleId,
      Amount: amount,
      Description: description,
      IncomeDetail: description,
      Modified: new Date(),
    },
  });

  revalidatePath("/transactions");
  redirect("/transactions");
}
