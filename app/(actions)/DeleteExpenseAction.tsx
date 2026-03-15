"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function DeleteExpenseAction(id: number) {
  if (!id) throw new Error("Invalid Expense ID");

  await prisma.expenses.deleteMany({
    where: {
      ExpenseID: id,
    },
  });

  revalidatePath("/transactions");
}
