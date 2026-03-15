import { prisma } from "@/lib/prisma";
import UnifiedTransactionForm from "@/app/components/UnifiedTransactionForm";
import { notFound } from "next/navigation";
import { getSession } from "@/lib/auth";

export default async function EditIncomePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const incomeId = parseInt(id);

  if (isNaN(incomeId)) return <h3>Invalid Income ID</h3>;

  const session = await getSession();
  const isAdmin = session?.user?.role === "ADMIN";
  const userId = session?.user?.id;

  const [income, categories, subCategories, projects, peoples] = await Promise.all([
    prisma.incomes.findUnique({ where: { IncomeID: incomeId } }),
    prisma.categories.findMany({ where: { IsActive: true } }),
    prisma.sub_categories.findMany({ where: { IsActive: true } }),
    prisma.projects.findMany({
      where: isAdmin ? {} : {
        assignedPeoples: { some: { PeopleID: userId } },
        IsActive: true
      },
      orderBy: { ProjectName: "asc" }
    }),
    prisma.peoples.findMany({
      where: isAdmin ? {} : { PeopleID: userId },
      orderBy: { PeopleName: "asc" }
    }),
  ]);

  if (!income) return notFound();

  const initialData = {
    id: income.IncomeID,
    type: "Income",
    date: income.IncomeDate,
    amount: Number(income.Amount),
    categoryId: income.CategoryID,
    subCategoryId: income.SubCategoryID,
    projectId: income.ProjectID,
    peopleId: income.PeopleID,
    attachmentPath: income.AttachmentPath,
    description: income.Description,
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-text-primary">✏️ Edit Income</h2>
        <p className="text-text-secondary text-sm">Update the details for this revenue stream.</p>
      </div>

      <div className="premium-card">
        <UnifiedTransactionForm
          categories={categories}
          subCategories={subCategories}
          projects={projects}
          peoples={peoples}
          initialData={initialData}
        />
      </div>
    </div>
  );
}
