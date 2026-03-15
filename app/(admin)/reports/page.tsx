import { prisma } from "@/lib/prisma";
import Link from "next/link";
import ReportsCharts from "@/app/components/ReportsCharts";
import { getSession } from "@/lib/auth";

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default async function ReportsPage() {
  const currentYear = new Date().getFullYear();
  const session = await getSession();
  const isAdmin = session?.user?.role === "ADMIN";
  const userId = session?.user?.id;

  // ── Fetch all data in parallel ──────────────────────────────────────────────
  const [allExpenses, allIncomes, categories, projects] = await Promise.all([
    prisma.expenses.findMany({
      where: isAdmin ? { UserID: userId } : { PeopleID: userId },
      select: { Amount: true, ExpenseDate: true, CategoryID: true, ProjectID: true },
    }),
    prisma.incomes.findMany({
      where: isAdmin ? { UserID: userId } : { PeopleID: userId },
      select: { Amount: true, IncomeDate: true },
    }),
    prisma.categories.findMany({
      where: { UserID: userId },
      select: { CategoryID: true, CategoryName: true },
    }),
    prisma.projects.findMany({
      where: isAdmin ? { UserID: userId } : {
        assignedPeoples: { some: { PeopleID: userId } }
      },
      select: { ProjectID: true, ProjectName: true },
    }),
  ]);

  // ── Totals ──────────────────────────────────────────────────────────────────
  const totalIncome = allIncomes.reduce((s, r) => s + Number(r.Amount), 0);
  const totalExpense = allExpenses.reduce((s, r) => s + Number(r.Amount), 0);
  const netSavings = totalIncome - totalExpense;

  // ── Month-wise (current year) ────────────────────────────────────────────────
  const monthlyExpense = Array(12).fill(0);
  const monthlyIncome = Array(12).fill(0);

  allExpenses.forEach((e) => {
    const d = new Date(e.ExpenseDate);
    if (d.getFullYear() === currentYear) {
      monthlyExpense[d.getMonth()] += Number(e.Amount);
    }
  });

  allIncomes.forEach((i) => {
    const d = new Date(i.IncomeDate);
    if (d.getFullYear() === currentYear) {
      monthlyIncome[d.getMonth()] += Number(i.Amount);
    }
  });

  // ── Category-wise (expenses only) ────────────────────────────────────────────
  const categoryMap: Record<number, number> = {};
  allExpenses.forEach((e) => {
    if (e.CategoryID) {
      categoryMap[e.CategoryID] = (categoryMap[e.CategoryID] || 0) + Number(e.Amount);
    }
  });

  const categoryLookup = Object.fromEntries(categories.map((c) => [c.CategoryID, c.CategoryName]));

  const categoryEntries = Object.entries(categoryMap)
    .map(([id, amt]) => ({ label: categoryLookup[Number(id)] || `Cat #${id}`, amount: amt }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 10);

  const categoryLabels = categoryEntries.map((c) => c.label);
  const categoryAmounts = categoryEntries.map((c) => Math.round(c.amount));

  // ── Project-wise (expenses only) ─────────────────────────────────────────────
  const projectMap: Record<number, number> = {};
  allExpenses.forEach((e) => {
    if (e.ProjectID) {
      projectMap[e.ProjectID] = (projectMap[e.ProjectID] || 0) + Number(e.Amount);
    }
  });

  const projectLookup = Object.fromEntries(projects.map((p) => [p.ProjectID, p.ProjectName]));

  const projectEntries = Object.entries(projectMap)
    .map(([id, amt]) => ({ label: projectLookup[Number(id)] || `Project #${id}`, amount: amt }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 8);

  const projectLabels = projectEntries.map((p) => p.label);
  const projectAmounts = projectEntries.map((p) => Math.round(p.amount));

  // ── Category summary table ────────────────────────────────────────────────────
  const totalCatExpense = categoryAmounts.reduce((s, v) => s + v, 0) || 1;

  // Count transactions per category
  const categoryTxnCount: Record<number, number> = {};
  allExpenses.forEach((e) => {
    if (e.CategoryID) categoryTxnCount[e.CategoryID] = (categoryTxnCount[e.CategoryID] || 0) + 1;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">📊 Reports</h2>
          <p className="text-text-secondary mt-1 text-sm">
            Financial analytics — live data from your records
          </p>
        </div>
        <Link
          href="/export"
          className="flex items-center gap-2 px-5 py-2.5 bg-brand-blue text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-premium"
        >
          📤 Export Data
        </Link>
      </div>

      {/* Summary Stats (real totals) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="premium-card">
          <p className="text-text-secondary font-medium mb-1 text-sm">Total Income</p>
          <h3 className="text-3xl font-bold text-emerald-600">
            ₹{totalIncome.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
          </h3>
          <p className="text-xs text-emerald-500 mt-1">{allIncomes.length} transactions</p>
        </div>
        <div className="premium-card">
          <p className="text-text-secondary font-medium mb-1 text-sm">Total Expense</p>
          <h3 className="text-3xl font-bold text-red-500">
            ₹{totalExpense.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
          </h3>
          <p className="text-xs text-red-400 mt-1">{allExpenses.length} transactions</p>
        </div>
        <div className="premium-card">
          <p className="text-text-secondary font-medium mb-1 text-sm">Net Savings</p>
          <h3 className={`text-3xl font-bold ${netSavings >= 0 ? "text-brand-blue" : "text-red-600"}`}>
            {netSavings >= 0 ? "+" : ""}₹{Math.abs(netSavings).toLocaleString("en-IN", { maximumFractionDigits: 0 })}
          </h3>
          <p className="text-xs text-text-secondary mt-1">
            {totalIncome > 0 ? ((netSavings / totalIncome) * 100).toFixed(1) : 0}% savings rate
          </p>
        </div>
      </div>

      {/* Charts — Client Component */}
      <ReportsCharts
        monthLabels={MONTH_NAMES}
        monthlyIncome={monthlyIncome}
        monthlyExpense={monthlyExpense}
        categoryLabels={categoryLabels}
        categoryAmounts={categoryAmounts}
        projectLabels={projectLabels}
        projectAmounts={projectAmounts}
      />

      {/* Category Breakdown Table */}
      <div className="premium-card">
        <h3 className="text-lg font-bold text-text-primary mb-4">Category Breakdown</h3>
        {categoryEntries.length === 0 ? (
          <p className="text-text-secondary text-sm py-4 text-center">No expense records with categories yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr>
                  <th className="table-header">Category</th>
                  <th className="table-header">Transactions</th>
                  <th className="table-header">Total Spent</th>
                  <th className="table-header">% of Expenses</th>
                </tr>
              </thead>
              <tbody>
                {categoryEntries.map((row, i) => {
                  const catId = Number(Object.keys(categoryMap)[i]);
                  const txns = categoryTxnCount[catId] || 0;
                  const pct = Math.round((row.amount / totalCatExpense) * 100);
                  return (
                    <tr key={row.label} className="table-row">
                      <td className="px-6 py-3 font-medium text-text-primary">{row.label}</td>
                      <td className="px-6 py-3 text-text-secondary">{txns}</td>
                      <td className="px-6 py-3 font-semibold text-red-600">
                        ₹{Math.round(row.amount).toLocaleString("en-IN")}
                      </td>
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-28 bg-slate-100 rounded-full h-1.5">
                            <div
                              className="h-1.5 rounded-full bg-brand-blue"
                              style={{ width: `${Math.min(pct * 3.5, 100)}%` }}
                            />
                          </div>
                          <span className="text-sm text-text-secondary">{pct}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
