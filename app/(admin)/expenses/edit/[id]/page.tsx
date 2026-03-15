import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import UnifiedTransactionForm from "@/app/components/UnifiedTransactionForm";
import { getSession } from "@/lib/auth";

export default async function EditExpensePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const expenseId = parseInt(id);

  if (isNaN(expenseId)) return <h3>Invalid Expense ID</h3>;

  const session = await getSession();
  const isAdmin = session?.user?.role === "ADMIN";
  const userId = session?.user?.id;

  const [expense, categories, subCategories, projects, peoples] = await Promise.all([
    prisma.expenses.findUnique({ where: { ExpenseID: expenseId } }),
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

  if (!expense) return notFound();

  const initialData = {
    id: expense.ExpenseID,
    type: "Expense",
    date: expense.ExpenseDate,
    amount: Number(expense.Amount),
    categoryId: expense.CategoryID,
    subCategoryId: expense.SubCategoryID,
    projectId: expense.ProjectID,
    peopleId: expense.PeopleID,
    attachmentPath: expense.AttachmentPath,
    expenseDetail: expense.ExpenseDetail,
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-text-primary">✏️ Edit Expense</h2>
        <p className="text-text-secondary text-sm">Update the details of this transaction.</p>
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
