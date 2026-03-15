"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function DeleteIncomeAction(id: number) {
  if (!id) throw new Error("Invalid Income ID");

  await prisma.incomes.deleteMany({
    where: {
      IncomeID: id,
    },
  });

  revalidatePath("/transactions");
}
