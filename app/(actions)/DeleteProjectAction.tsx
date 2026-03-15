"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function DeleteProjectAction(projectId: number) {
  if (!projectId || isNaN(projectId)) {
    throw new Error("Invalid Project ID");
  }

  await prisma.projects.delete({
    where: { ProjectID: projectId },
  });

  revalidatePath("/projects");
}
