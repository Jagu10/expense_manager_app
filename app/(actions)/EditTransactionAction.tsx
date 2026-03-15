"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const editSchema = z.object({
  amount: z.number().min(0.01, "Amount must be at least 0.01"),
  date: z.string().min(1, "Date is required"),
  projectId: z.number().positive("Project is required"),
  peopleId: z.number().positive("Person is required"),
});

export async function EditTransactionAction(formData: FormData) {
  const transactionType = formData.get("transactionType") as string;
  const id = Number(formData.get("transactionId"));
  
  const date = formData.get(transactionType === "Expense" ? "expenseDate" : "incomeDate") as string;
  const amount = Number(formData.get("amount"));
  const categoryIdRaw = formData.get("categoryId");
  const subCategoryRaw = formData.get("subCategoryId");
  const projectIdRaw = formData.get("projectId");
  const peopleIdRaw = formData.get("peopleId");

  const categoryId = categoryIdRaw ? Number(categoryIdRaw) : null;
  const subCategoryId = subCategoryRaw ? Number(subCategoryRaw) : null;
  const projectId = projectIdRaw ? Number(projectIdRaw) : null;
  const peopleId = peopleIdRaw ? Number(peopleIdRaw) : 1;
  const remarks = formData.get(transactionType === "Expense" ? "expenseDetail" : "description") as string;

  const parsed = editSchema.safeParse({ amount, date, projectId, peopleId });
  if (!parsed.success) {
    throw new Error(parsed.error.message);
  }

  if (!id || isNaN(id)) {
    throw new Error("Invalid Transaction ID");
  }

  if (transactionType === "Expense") {
    await prisma.expenses.update({
      where: { ExpenseID: id },
      data: {
        ExpenseDate: new Date(date),
        Amount: amount,
        CategoryID: categoryId,
        SubCategoryID: subCategoryId,
        ProjectID: projectId,
        PeopleID: peopleId,
        ExpenseDetail: remarks,
        Modified: new Date(),
      },
    });
  } else {
    await prisma.incomes.update({
      where: { IncomeID: id },
      data: {
        IncomeDate: new Date(date),
        Amount: amount,
        CategoryID: categoryId,
        SubCategoryID: subCategoryId,
        ProjectID: projectId,
        PeopleID: peopleId,
        Description: remarks,
        Modified: new Date(),
      },
    });
  }

  revalidatePath("/transactions");
  redirect("/transactions");
}
