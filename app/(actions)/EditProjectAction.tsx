"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const editProjectSchema = z.object({
  projectName: z.string().min(1, "Project name is required"),
});

export async function EditProjectAction(formData: FormData) {
  const projectId = Number(formData.get("projectId"));
  const projectName = formData.get("projectName") as string;
  const projectLogo = formData.get("projectLogo") as string | null;
  const startDate = formData.get("startDate") as string | null;
  const endDate = formData.get("endDate") as string | null;
  const detail = formData.get("detail") as string | null;
  const description = formData.get("description") as string | null;
  const isActive = formData.get("isActive") === "on";
  if (!projectId || isNaN(projectId)) {
    throw new Error("Invalid Project ID");
  }

  const parsed = editProjectSchema.safeParse({ projectName });
  if (!parsed.success) {
    throw new Error(parsed.error.message);
  }

  const peopleIds = formData.getAll("peopleIds").map(id => Number(id));

  await prisma.projects.update({
    where: { ProjectID: projectId },
    data: {
      ProjectName: projectName,
      ProjectLogo: projectLogo,
      ProjectStartDate: startDate ? new Date(startDate) : null,
      ProjectEndDate: endDate ? new Date(endDate) : null,
      ProjectDetail: detail,
      Description: description,
      IsActive: isActive,
      Modified: new Date(),
      assignedPeoples: {
        set: peopleIds.map(id => ({ PeopleID: id }))
      }
    },
  });

  revalidatePath("/projects");
  redirect("/projects");
}
