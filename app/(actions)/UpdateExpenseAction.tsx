"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function UpdateExpenseAction(formData: FormData) {
  const id = Number(formData.get("ExpenseID"));
  const amount = Number(formData.get("amount"));
  const expenseDetail = formData.get("expenseDetail") as string;
  const description = formData.get("description") as string;
  const categoryIdRaw = formData.get("categoryId");
  const subCategoryIdRaw = formData.get("subCategoryId");
  const projectIdRaw = formData.get("projectId");
  const peopleIdRaw = formData.get("peopleId");
  const dateRaw = formData.get("expenseDate") as string;

  const categoryId = categoryIdRaw ? Number(categoryIdRaw) : null;
  const subCategoryId = subCategoryIdRaw ? Number(subCategoryIdRaw) : null;
  const projectId = projectIdRaw ? Number(projectIdRaw) : null;
  const peopleId = peopleIdRaw ? Number(peopleIdRaw) : 0;

  if (!id || isNaN(id)) {
    throw new Error("Invalid Expense ID");
  }

  await prisma.expenses.update({
    where: {
      ExpenseID: id,
    },
    data: {
      Amount: amount,
      ExpenseDetail: expenseDetail,
      Description: description,
      CategoryID: categoryId,
      SubCategoryID: subCategoryId,
      ProjectID: projectId,
      PeopleID: peopleId,
      ExpenseDate: new Date(dateRaw),
      Modified: new Date(),
    },
  });

  revalidatePath("/transactions");
  redirect("/transactions");
}
