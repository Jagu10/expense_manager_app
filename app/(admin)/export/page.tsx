import { prisma } from "@/lib/prisma";
import Link from "next/link";
import ExportActions from "@/app/components/ExportActions";
import { getSession } from "@/lib/auth";

export default async function ExportPage() {
  const session = await getSession();
  const isAdmin = session?.user?.role === "ADMIN";
  const userId = session?.user?.id;

  // Fetch everything in parallel with isolation
  const [expenses, incomes, categories, projects] = await Promise.all([
    prisma.expenses.findMany({
      where: isAdmin ? { UserID: userId } : { PeopleID: userId },
      orderBy: { ExpenseDate: 'desc' },
    }),
    prisma.incomes.findMany({
      where: isAdmin ? { UserID: userId } : { PeopleID: userId },
      orderBy: { IncomeDate: 'desc' },
    }),
    prisma.categories.findMany({
      where: { UserID: userId },
    }),
    prisma.projects.findMany({
      where: isAdmin ? { UserID: userId } : {
        assignedPeoples: { some: { PeopleID: userId } }
      },
    }),
  ]);

  // Create lookups for names
  const categoryLookup = Object.fromEntries(categories.map(c => [c.CategoryID, c.CategoryName]));
  const projectLookup = Object.fromEntries(projects.map(p => [p.ProjectID, p.ProjectName]));

  // Combine and format for export and preview
  const combinedData = [
    ...expenses.map(e => ({
      Date: e.ExpenseDate.toISOString().split('T')[0],
      Description: e.ExpenseDetail || e.Description || "No description",
      Category: categoryLookup[e.CategoryID!] || "Uncategorized",
      Project: projectLookup[e.ProjectID!] || "No Project",
      Type: "Expense",
      Amount: Number(e.Amount),
    })),
    ...incomes.map(i => ({
      Date: i.IncomeDate.toISOString().split('T')[0],
      Description: i.IncomeDetail || i.Description || "No description",
      Category: categoryLookup[i.CategoryID!] || "Uncategorized",
      Project: projectLookup[i.ProjectID!] || "No Project",
      Type: "Income",
      Amount: Number(i.Amount),
    })),
  ].sort((a, b) => new Date(b.Date).getTime() - new Date(a.Date).getTime());

  // Data specifically for Excel export (cleaner names)
  const exportData = combinedData.map(d => ({
    Date: d.Date,
    Description: d.Description,
    Category: d.Category,
    Project: d.Project,
    Type: d.Type,
    Amount: d.Amount,
  }));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center print:hidden">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">📤 Export Data</h2>
          <p className="text-text-secondary mt-1 text-sm">
            Download your financial records based on live database data
          </p>
        </div>
        <Link
          href="/reports"
          className="flex items-center gap-2 px-5 py-2.5 bg-white border border-border-light text-text-primary rounded-xl font-semibold hover:bg-slate-50 transition-colors shadow-premium"
        >
          ← Back to Reports
        </Link>
      </div>

      {/* Export Options Cards */}
      <div className="print:hidden">
        <ExportActions data={exportData} />
      </div>

      {/* Preview Table */}
      <div className="premium-card bg-white">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-text-primary">Data Preview / Report</h3>
          <span className="text-xs font-semibold px-3 py-1 bg-blue-50 text-brand-blue rounded-full border border-blue-100">
            {combinedData.length} records found
          </span>
        </div>
        
        {combinedData.length === 0 ? (
          <div className="text-center py-12 text-text-secondary">
            <p>No transactions found in the database.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="table-header border-b">Date</th>
                  <th className="table-header border-b">Description</th>
                  <th className="table-header border-b">Category</th>
                  <th className="table-header border-b">Project</th>
                  <th className="table-header border-b">Type</th>
                  <th className="table-header border-b text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {combinedData.map((row, i) => (
                  <tr key={i} className="table-row border-b last:border-0">
                    <td className="px-6 py-3 text-text-secondary text-sm whitespace-nowrap">{row.Date}</td>
                    <td className="px-6 py-3 font-medium text-text-primary">{row.Description}</td>
                    <td className="px-6 py-3 text-text-secondary text-sm">{row.Category}</td>
                    <td className="px-6 py-3 text-sm font-medium text-brand-blue italic">{row.Project}</td>
                    <td className="px-6 py-3">
                      <span className={row.Type === "Expense" ? "badge-expense" : "badge-income"}>
                        {row.Type}
                      </span>
                    </td>
                    <td className={`px-6 py-3 font-bold text-right ${row.Type === "Expense" ? "text-text-primary" : "text-emerald-600"}`}>
                      {row.Type === "Expense" ? "-" : "+"}₹{row.Amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))}
              </tbody>
              {/* Table Footer for printing total if needed */}
              <tfoot className="hidden print:table-footer-group">
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-right font-bold">Total Net:</td>
                  <td className="px-6 py-4 text-right font-bold">
                    ₹{combinedData.reduce((acc, curr) => acc + (curr.Type === "Income" ? curr.Amount : -curr.Amount), 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>

      {/* Style for printing */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body { background-color: white !important; }
          .premium-card { border: none !important; box-shadow: none !important; padding: 0 !important; }
          .ml-64 { margin-left: 0 !important; }
          aside { display: none !important; }
          main { padding: 0 !important; margin: 0 !important; }
          .max-w-7xl { max-width: 100% !important; width: 100% !important; }
        }
      `}} />
    </div>
  );
}
