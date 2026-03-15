import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function TransactionViewPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ type?: string }>;
}) {
  const { id } = await params;
  const resolvedSearchParams = await searchParams;
  const transactionId = parseInt(id);
  const type = resolvedSearchParams.type || "Expense";

  if (isNaN(transactionId)) return <h3>Invalid Transaction ID</h3>;

  let transactionData: any = null;

  if (type === "Expense") {
    transactionData = await prisma.expenses.findUnique({
      where: { ExpenseID: transactionId },
    });
  } else {
    transactionData = await prisma.incomes.findUnique({
      where: { IncomeID: transactionId },
    });
  }

  if (!transactionData) return notFound();

  // Fetch related labels for a better UI instead of just showing IDs
  const [category, subCategory, project, person] = await Promise.all([
    transactionData.CategoryID ? prisma.categories.findUnique({ where: { CategoryID: transactionData.CategoryID } }) : null,
    transactionData.SubCategoryID ? prisma.sub_categories.findUnique({ where: { SubCategoryID: transactionData.SubCategoryID } }) : null,
    transactionData.ProjectID ? prisma.projects.findUnique({ where: { ProjectID: transactionData.ProjectID } }) : null,
    transactionData.PeopleID ? prisma.peoples.findUnique({ where: { PeopleID: transactionData.PeopleID } }) : null,
  ]);

  const t = {
    date: type === "Expense" ? transactionData.ExpenseDate : transactionData.IncomeDate,
    amount: Number(transactionData.Amount),
    remarks: type === "Expense" ? transactionData.ExpenseDetail : transactionData.Description,
    attachment: transactionData.AttachmentPath,
    categoryName: category?.CategoryName || "None",
    subCategoryName: subCategory?.SubCategoryName || "None",
    projectName: project?.ProjectName || "None",
    personName: person?.PeopleName || "None",
  };

  const isExpense = type === "Expense";

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-text-primary flex items-center gap-2">
            📄 Transaction Details
            <span className={isExpense ? 'badge-expense' : 'badge-income'}>{type}</span>
          </h2>
          <p className="text-text-secondary text-sm mt-1">Full view of this record.</p>
        </div>
        <Link 
          href="/transactions" 
          className="px-6 py-2 rounded-xl text-text-secondary font-medium hover:bg-slate-100 transition-all border border-border-light"
        >
          ← Back
        </Link>
      </div>

      {/* Main Info Card */}
      <div className="premium-card relative overflow-hidden">
        {/* Decorative Top Accent */}
        <div className={`absolute top-0 left-0 w-full h-2 ${isExpense ? 'bg-red-500' : 'bg-emerald-500'}`} />

        <div className="pt-4 flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-border-light">
          <div>
            <p className="text-text-secondary font-medium uppercase tracking-wider text-xs mb-1">Date</p>
            <p className="text-xl font-bold text-text-primary">
              {new Date(t.date).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <div className="md:text-right">
            <p className="text-text-secondary font-medium uppercase tracking-wider text-xs mb-1">Amount</p>
            <p className={`text-4xl font-extrabold ${isExpense ? 'text-red-600' : 'text-emerald-600'}`}>
              {isExpense ? '-' : '+'}₹{Number(t.amount).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
          <div>
            <p className="text-text-secondary text-sm font-semibold mb-1">Category</p>
            <p className="text-lg font-medium text-text-primary">{t.categoryName}</p>
          </div>
          
          <div>
            <p className="text-text-secondary text-sm font-semibold mb-1">Sub Category</p>
            <p className="text-lg font-medium text-text-primary">{t.subCategoryName}</p>
          </div>

          <div>
            <p className="text-text-secondary text-sm font-semibold mb-1">Project</p>
            <p className="text-lg font-medium text-text-primary">{t.projectName}</p>
          </div>

          <div>
            <p className="text-text-secondary text-sm font-semibold mb-1">Person</p>
            <p className="text-lg font-medium text-text-primary">{t.personName}</p>
          </div>
        </div>

        {/* Remarks Box */}
        <div className="mt-8 bg-slate-50 p-6 rounded-2xl border border-border-light">
          <p className="text-text-secondary text-sm font-semibold mb-2">Remarks / Details</p>
          <p className="text-text-primary leading-relaxed">
            {t.remarks || <span className="text-slate-400 italic">No remarks provided.</span>}
          </p>
        </div>

        {/* Attachment Box */}
        {t.attachment && (
          <div className="mt-6 flex items-center justify-between bg-blue-50/50 p-4 rounded-xl border border-blue-100">
            <div className="flex items-center gap-3">
              <span className="text-2xl">📎</span>
              <div>
                <p className="text-sm font-semibold text-text-primary">Attachment File</p>
                <p className="text-xs text-brand-blue">{t.attachment}</p>
              </div>
            </div>
            <button className="px-4 py-2 bg-white text-brand-blue text-sm font-bold rounded-lg border border-blue-200 shadow-sm hover:bg-blue-50 transition-colors">
              Download
            </button>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4">
        <Link 
          href={`/${isExpense ? 'expenses' : 'incomes'}/edit/${transactionId}`}
          className="px-8 py-2.5 rounded-xl bg-slate-800 text-white font-bold hover:bg-slate-700 transition-colors shadow-sm"
        >
          ✏️ Edit {type}
        </Link>
      </div>
    </div>
  );
}
