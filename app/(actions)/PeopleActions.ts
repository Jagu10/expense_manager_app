"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { getSession } from "@/lib/auth";

export async function AddPeopleAction(formData: FormData) {
  const peopleCode = formData.get("peopleCode") as string;
  const peopleName = formData.get("peopleName") as string;
  const email = formData.get("email") as string;
  const mobileNo = formData.get("mobileNo") as string;
  const password = formData.get("password") as string;
  const description = formData.get("description") as string;
  const isActive = formData.get("isActive") === "on";

  const hashedPassword = await bcrypt.hash(password, 10);

  // Get session user
  const session = await getSession();
  const userId = session?.user?.id || 1;

  if (session?.user?.role !== "ADMIN") {
    throw new Error("Only admins can manage people");
  }

  await prisma.peoples.create({
    data: {
      PeopleCode: peopleCode,
      PeopleName: peopleName,
      Email: email,
      MobileNo: mobileNo,
      Password: hashedPassword,
      Description: description,
      IsActive: isActive,
      UserID: userId,
      Created: new Date(),
      Modified: new Date(),
    },
  });

  revalidatePath("/peoples");
  redirect("/peoples");
}

export async function UpdatePeopleAction(formData: FormData) {
  const id = Number(formData.get("PeopleID"));
  const peopleCode = formData.get("peopleCode") as string;
  const peopleName = formData.get("peopleName") as string;
  const email = formData.get("email") as string;
  const mobileNo = formData.get("mobileNo") as string;
  const password = formData.get("password") as string | null;
  const description = formData.get("description") as string;
  const isActive = formData.get("isActive") === "on";

  if (!id) throw new Error("Invalid ID");

  const updateData: any = {
    PeopleCode: peopleCode,
    PeopleName: peopleName,
    Email: email,
    MobileNo: mobileNo,
    Description: description,
    IsActive: isActive,
    Modified: new Date(),
  };

  if (password) {
    updateData.Password = await bcrypt.hash(password, 10);
  }

  await prisma.peoples.update({
    where: { PeopleID: id },
    data: updateData,
  });

  revalidatePath("/peoples");
  redirect("/peoples");
}

export async function DeletePeopleAction(id: number) {
  await prisma.peoples.delete({
    where: { PeopleID: id },
  });

  revalidatePath("/peoples");
}
