import { prisma } from "@/lib/prisma";
import UnifiedTransactionForm from "@/app/components/UnifiedTransactionForm";
import { getSession } from "@/lib/auth";

export default async function AddTransactionPage() {
  const session = await getSession();
  const isAdmin = session?.user?.role === "ADMIN";
  const userId = session?.user?.id;

  const adminId = session?.user?.adminId;

  const categories = await prisma.categories.findMany({
    where: { IsActive: true, UserID: adminId },
    orderBy: { CategoryName: "asc" },
  });

  const subCategories = await prisma.sub_categories.findMany({
    where: { IsActive: true, UserID: adminId },
    orderBy: { SubCategoryName: "asc" },
  });

  const projects = await prisma.projects.findMany({
    where: isAdmin 
      ? { UserID: adminId } 
      : {
          assignedPeoples: {
            some: {
              PeopleID: userId
            }
          },
          IsActive: true,
          UserID: adminId
        },
    orderBy: { ProjectName: "asc" },
  });

  const peoples = await prisma.peoples.findMany({
    where: isAdmin 
      ? { UserID: adminId } 
      : { PeopleID: userId },
    orderBy: { PeopleName: "asc" },
  });

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-text-primary">➕ Add Record</h2>
        <p className="text-text-secondary text-sm">Log a new income or expense transaction.</p>
      </div>

      <div className="premium-card">
        <UnifiedTransactionForm
          categories={categories}
          subCategories={subCategories}
          projects={projects}
          peoples={peoples}
        />
      </div>
    </div>
  );
}
