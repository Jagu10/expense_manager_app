"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

export async function UpdateProfileAction(prevState: any, formData: FormData) {
  const session = await getSession();
  if (!session) {
    return { success: false, message: "Unauthorized" };
  }

  const role = session.user.role;
  const userId = session.user.id;
  const isAdmin = role === "ADMIN";

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const mobile = formData.get("mobile") as string;
  const oldPassword = formData.get("oldPassword") as string;
  const newPassword = formData.get("password") as string;

  try {
    const updateData: any = {
      Modified: new Date(),
    };

    // Fetch current user to verify password if change is requested
    if (newPassword) {
      if (!oldPassword) {
        return { success: false, message: "Please enter your current password to set a new one." };
      }

      let currentAccount;
      if (isAdmin) {
        currentAccount = await prisma.users.findUnique({ where: { UserID: userId } });
      } else {
        currentAccount = await prisma.peoples.findUnique({ where: { PeopleID: userId } });
      }

      const isMatch = await bcrypt.compare(oldPassword, currentAccount?.Password || "");
      if (!isMatch) {
        return { success: false, message: "Incorrect current password." };
      }
      
      updateData.Password = await bcrypt.hash(newPassword, 10);
    }

    if (isAdmin) {
      if (name) updateData.UserName = name;
      if (email) updateData.EmailAddress = email;
      if (mobile) updateData.MobileNo = mobile;

      await prisma.users.update({
        where: { UserID: userId },
        data: updateData,
      });
    } else {
      if (name) updateData.PeopleName = name;
      if (email) updateData.Email = email;
      if (mobile) updateData.MobileNo = mobile;

      await prisma.peoples.update({
        where: { PeopleID: userId },
        data: updateData,
      });
    }

    revalidatePath("/settings");
    return { success: true, message: "Profile updated successfully!" };
  } catch (error: any) {
    console.error("Update profile error:", error);
    return { success: false, message: "Failed to update profile. Please try again." };
  }
}
