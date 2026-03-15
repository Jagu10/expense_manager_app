"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { login } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function loginUser(formData: FormData): Promise<void> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    throw new Error("Email and Password required");
  }

  // Check users table first
  let dbUser = await prisma.users.findFirst({
    where: { EmailAddress: email },
  });

  let role: string;
  let userId: number;
  let userName: string;

  if (dbUser) {
    if ((dbUser as any).IsActive === false) {
      throw new Error("Your account is inactive. Please contact admin.");
    }
    role = dbUser.Role; // Use Role from users table (ADMIN or USER)
    userId = dbUser.UserID;
    userName = dbUser.UserName;
  } else {
    // If not found in users, check peoples table (User role)
    const person = await prisma.peoples.findFirst({
      where: { Email: email },
    });
    if (person) {
      if (person.IsActive === false) {
        throw new Error("Your account is inactive. Please contact admin.");
      }
      dbUser = person as any;
      role = "USER";
      userId = person.PeopleID;
      userName = person.PeopleName;
    } else {
      throw new Error("Invalid email or password");
    }
  }

  const isPasswordCorrect = await bcrypt.compare(password, (dbUser as any).Password);

  if (!isPasswordCorrect) {
    throw new Error("Invalid email or password");
  }

  // Create session
  const sessionData = {
    id: userId,
    email: email,
    role: role,
    name: userName,
    adminId: role === "ADMIN" ? userId : (dbUser as any).UserID
  };

  await login(sessionData);

  if (role === "ADMIN") {
    redirect("/dashboard");
  } else {
    redirect("/dashboarduser");
  }
}
