import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { DeleteIncomeAction } from "@/app/(actions)/DeleteIncomeAction";
import { DeleteExpenseAction } from "@/app/(actions)/DeleteExpenseAction";
import TransactionFilter from "@/app/components/TransactionFilter";
import { getSession } from "@/lib/auth";

export default async function TransactionsPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; search?: string; sort?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const typeFilter = resolvedSearchParams.type || "All";
  const searchFilter = resolvedSearchParams.search || "";
  const sortOption = resolvedSearchParams.sort || "date-desc";

  const session = await getSession();
  const isAdmin = session?.user?.role === "ADMIN";
  const userId = session?.user?.id;
  const adminId = session?.user?.adminId;

  // Fetch data with role-based filtering
  const [incomes, expenses, categories, subCategories, projects] = await Promise.all([
    prisma.incomes.findMany({ 
      where: isAdmin ? { UserID: adminId } : { PeopleID: userId },
      orderBy: { IncomeDate: "desc" } 
    }),
    prisma.expenses.findMany({ 
      where: isAdmin ? { UserID: adminId } : { PeopleID: userId },
      orderBy: { ExpenseDate: "desc" } 
    }),
    prisma.categories.findMany({
      where: { UserID: adminId }
    }),
    prisma.sub_categories.findMany({
      where: { UserID: adminId }
    }),
    prisma.projects.findMany({
      where: isAdmin ? { UserID: adminId } : {
        assignedPeoples: { some: { PeopleID: userId } },
        UserID: adminId
      }
    }),
  ]);

  // Create lookup maps
  const categoryMap = new Map(categories.map(c => [c.CategoryID, c.CategoryName]));
  const subCategoryMap = new Map(subCategories.map(sc => [sc.SubCategoryID, sc.SubCategoryName]));
  const projectMap = new Map<number, string>(projects.map((p: any) => [p.ProjectID, p.ProjectName]));

  // Combine and map
  let allTransactions = [
    ...incomes.map((i: any) => ({
      id: i.IncomeID,
      type: "Income",
      date: i.IncomeDate,
      description: i.Description || i.IncomeDetail || "No detail",
      amount: Number(i.Amount),
      category: categoryMap.get(i.CategoryID || 0) || "Income",
      subcategory: subCategoryMap.get(i.SubCategoryID || 0) || "",
      project: projectMap.get(i.ProjectID || 0) || "N/A",
      editHref: `/incomes/edit/${i.IncomeID}`,
      deleteAction: "income",
    })),
    ...expenses.map((e: any) => ({
      id: e.ExpenseID,
      type: "Expense",
      date: e.ExpenseDate,
      description: e.ExpenseDetail || "No detail",
      amount: Number(e.Amount),
      category: categoryMap.get(e.CategoryID || 0) || "General",
      subcategory: subCategoryMap.get(e.SubCategoryID || 0) || "",
      project: projectMap.get(e.ProjectID || 0) || "N/A",
      editHref: `/expenses/edit/${e.ExpenseID}`,
      deleteAction: "expense",
    })),
  ];

  // Calculate stats BEFORE filtering but AFTER mapping (for total balance)
  const totalIncome = incomes.reduce((sum, i) => sum + Number(i.Amount), 0);
  const totalExpense = expenses.reduce((sum, e) => sum + Number(e.Amount), 0);
  const balance = totalIncome - totalExpense;

  // Apply filters
  let filteredTransactions = allTransactions;
  
  if (typeFilter !== "All") {
    filteredTransactions = filteredTransactions.filter(t => t.type === typeFilter);
  }

  if (searchFilter) {
    const query = searchFilter.toLowerCase();
    filteredTransactions = filteredTransactions.filter(t => 
      t.description.toLowerCase().includes(query) || 
      t.category.toLowerCase().includes(query) ||
      t.subcategory.toLowerCase().includes(query)
    );
  }

  // Apply Sorting
  filteredTransactions.sort((a, b) => {
    switch (sortOption) {
      case "date-asc":
        return a.date.getTime() - b.date.getTime();
      case "amount-desc":
        return b.amount - a.amount;
      case "amount-asc":
        return a.amount - b.amount;
      case "date-desc":
      default:
        return b.date.getTime() - a.date.getTime();
    }
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">📋 Transactions</h2>
          <p className="text-text-secondary text-sm">Unified view of your financial movements.</p>
        </div>
        <Link 
          href="/transactions/add" 
          className="bg-brand-blue text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-brand-blue/90 transition-all font-medium shadow-sm"
        >
          <span className="text-xl">+</span> Add Record
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="premium-card">
          <p className="text-text-secondary font-medium mb-1">Total Expense</p>
          <h3 className="text-3xl font-bold text-red-600">-₹{totalExpense.toLocaleString()}</h3>
        </div>

        <div className="premium-card">
          <p className="text-text-secondary font-medium mb-1">Total Income</p>
          <h3 className="text-3xl font-bold text-emerald-600">+₹{totalIncome.toLocaleString()}</h3>
        </div>

        {/* <div className="premium-card bg-brand-blue border-none shadow-brand-blue/20">
          <p className="text-white/70 font-medium mb-1">Total Balance</p>
          <h3 className="text-3xl font-bold text-white">₹{balance.toLocaleString()}</h3>
        </div> */}
      </div>

      {/* Modern Filter Bar */}
      <TransactionFilter initialType={typeFilter} />


      {/* Transactions Table */}
      <div className="bg-white rounded-2xl border border-border-light shadow-premium overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="table-header">Date</th>
                <th className="table-header">Description</th>
                <th className="table-header">Category</th>
                <th className="table-header">Project</th>
                <th className="table-header">Type</th>
                <th className="table-header">Amount</th>
                <th className="table-header text-right px-6 w-32">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((t, idx) => {
                // Stabilize Server Action arguments using bind
                const deleteAction = t.deleteAction === 'income' 
                  ? DeleteIncomeAction.bind(null, t.id) 
                  : DeleteExpenseAction.bind(null, t.id);

                return (
                  <tr key={`${t.type}-${t.id}-${idx}`} className="table-row">
                    <td className="px-6 py-4 text-sm text-text-secondary">
                      {t.date.toISOString().slice(0, 10)}
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-text-primary">{t.description}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-text-primary">{t.category}</p>
                      {t.subcategory && <p className="text-xs text-text-secondary">{t.subcategory}</p>}
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-text-primary">{t.project}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={t.type === 'Expense' ? 'badge-expense' : 'badge-income'}>
                        {t.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className={`font-bold ${t.type === 'Expense' ? 'text-red-600' : 'text-emerald-600'}`}>
                        {t.type === 'Expense' ? '-' : '+'} ₹{t.amount.toLocaleString()}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2 w-32 whitespace-nowrap">
                       <Link
                        href={`/transactions/view/${t.id}?type=${t.type}`}
                        className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-border-light text-slate-500 hover:bg-slate-50 hover:text-brand-blue transition-colors"
                        title="View Details"
                      >
                        👁️
                      </Link>
                      <Link
                        href={t.editHref}
                        className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-border-light text-brand-blue hover:bg-slate-50 transition-colors"
                        title="Edit"
                      >
                        ✏️
                      </Link>
                      <form action={deleteAction} className="inline">
                        <button 
                          className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-border-light text-red-500 hover:bg-red-50 transition-colors"
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </form>
                    </td>
                  </tr>
                );
              })}
              {filteredTransactions.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-text-secondary italic">
                    No records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

