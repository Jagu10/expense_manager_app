"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { getSession } from "@/lib/auth";

const projectSchema = z.object({
  projectName: z.string().min(1, "Project name is required"),
  startDate: z.string().nullable().refine((val) => {
    if (!val) return true; // Optional date
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const inputDate = new Date(val);
    inputDate.setHours(0, 0, 0, 0);
    return inputDate >= today;
  }, "Start date cannot be in the past"),
});

export async function AddProjectAction(formData: FormData) {
  const projectName = formData.get("projectName") as string;
  const projectLogo = formData.get("projectLogo") as string | null;
  const startDate = formData.get("startDate") as string | null;
  const endDate = formData.get("endDate") as string | null;
  const detail = formData.get("detail") as string | null;
  const description = formData.get("description") as string | null;
  const isActive = formData.get("isActive") === "on";
  const peopleIds = formData.getAll("peopleIds").map(id => Number(id));

  // Get session user
  const session = await getSession();
  const adminId = session?.user?.adminId;

  if (!adminId) {
    throw new Error("Unauthorized: Admin session required");
  }

  const parsed = projectSchema.safeParse({ projectName, startDate });
  if (!parsed.success) {
    throw new Error(parsed.error.message);
  }

  await prisma.projects.create({
    data: {
      ProjectName: projectName,
      ProjectLogo: projectLogo,
      ProjectStartDate: startDate ? new Date(startDate) : null,
      ProjectEndDate: endDate ? new Date(endDate) : null,
      ProjectDetail: detail,
      Description: description,
      IsActive: isActive,
      UserID: adminId,
      Created: new Date(),
      Modified: new Date(),
      assignedPeoples: {
        connect: peopleIds.map(id => ({ PeopleID: id }))
      }
    },
  });

  revalidatePath("/projects");
  redirect("/projects");
}
