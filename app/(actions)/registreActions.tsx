"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { login } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function registerUser(formData: FormData): Promise<void> {
  const username = formData.get("username") as string;
  const email = formData.get("email") as string;
  const mobile = formData.get("mobile") as string;
  const password = formData.get("password") as string;
  const role = formData.get("role") as "ADMIN" | "USER";

  if (!username || !email || !mobile || !password || !role) {
    throw new Error("All fields are required");
  }

  const existingUser = await prisma.users.findFirst({
    where: { EmailAddress: email },
  });

  if (existingUser) {
    throw new Error("Email already registered");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await prisma.users.create({
    data: {
      UserName: username,
      EmailAddress: email,
      MobileNo: mobile,
      Password: hashedPassword,
      Role: role,
      IsActive:true,
      Created: new Date(),
      Modified: new Date(),
    },
  });

  await login({
    id: newUser.UserID,
    email: newUser.EmailAddress,
    role: role,
    name: newUser.UserName,
    adminId: newUser.UserID
  });

  if (role === "ADMIN") {
    redirect("/dashboard");
  } else {
    redirect("/dashboarduser");
  }
}
