"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { getSession } from "@/lib/auth";

const incomeSchema = z.object({
  amount: z.number().min(0.01, "Amount must be at least 0.01"),
  date: z.string().refine((val) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const inputDate = new Date(val);
    inputDate.setHours(0, 0, 0, 0);
    return inputDate >= today;
  }, "Date cannot be in the past"),
  projectId: z.number().positive("Project is required"),
  peopleId: z.number().positive("Person is required"),
});

export async function AddIncomeAction(formData: FormData) {
  const incomeDate = formData.get("incomeDate") as string;
  const categoryId = formData.get("categoryId");
  const subCategoryId = formData.get("subCategoryId");
  const peopleId = Number(formData.get("peopleId"));
  const projectId = formData.get("projectId");
  const amount = Number(formData.get("amount"));
  const description = formData.get("description") as string;
  const attachmentPath = formData.get("attachmentPath") as string;
  const parsedProjectId = Number(projectId);

  const parsed = incomeSchema.safeParse({ amount, date: incomeDate, projectId: parsedProjectId, peopleId });
  if (!parsed.success) {
    throw new Error(parsed.error.message);
  }

  // Get session user
  const session = await getSession();
  const creatorId = session?.user?.id || 1;
  const isUser = session?.user?.role === "USER";

  // If user is adding, they are the peopleId
  const finalPeopleId = isUser ? creatorId : peopleId;

  await prisma.incomes.create({
    data: {
      IncomeDate: new Date(incomeDate),
      CategoryID: categoryId ? Number(categoryId) : null,
      SubCategoryID: subCategoryId ? Number(subCategoryId) : null,
      PeopleID: finalPeopleId,
      ProjectID: projectId ? Number(projectId) : null,
      Amount: amount,
      Description: description,
      IncomeDetail: description,
      AttachmentPath: attachmentPath,
      UserID: session?.user?.adminId || 1, // Store Admin ID for isolation
      Created: new Date(),
      Modified: new Date(),
    },
  });

  // refresh page
  revalidatePath("/transactions");
  redirect("/transactions");
}
