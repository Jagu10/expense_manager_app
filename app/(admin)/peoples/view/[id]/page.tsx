import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function PeopleViewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const peopleId = Number(id);

  const session = await getSession();
  const adminId = session?.user?.adminId;

  const person = await prisma.peoples.findUnique({
    where: { PeopleID: peopleId, UserID: adminId },
    include: {
      projects: true
    }
  });

  if (!person) {
    notFound();
  }

  const [incomes, expenses, categories, subCategories] = await Promise.all([
    prisma.incomes.findMany({
      where: { PeopleID: peopleId, UserID: adminId },
      orderBy: { IncomeDate: 'desc' }
    }),
    prisma.expenses.findMany({
      where: { PeopleID: peopleId, UserID: adminId },
      orderBy: { ExpenseDate: 'desc' }
    }),
    prisma.categories.findMany({ where: { UserID: adminId } }),
    prisma.sub_categories.findMany({ where: { UserID: adminId } })
  ]);

  const categoryMap = new Map(categories.map(c => [c.CategoryID, c.CategoryName]));
  const subCategoryMap = new Map(subCategories.map(sc => [sc.SubCategoryID, sc.SubCategoryName]));
  const projectMap = new Map(person.projects.map(p => [p.ProjectID, p.ProjectName]));

  const allTransactions = [
    ...incomes.map(i => ({
      id: `income-${i.IncomeID}`,
      type: 'Income',
      date: i.IncomeDate,
      amount: Number(i.Amount),
      category: categoryMap.get(i.CategoryID || 0) || 'General',
      subcategory: subCategoryMap.get(i.SubCategoryID || 0) || '',
      project: projectMap.get(i.ProjectID || 0) || 'None',
      detail: i.IncomeDetail || i.Description || 'No detail'
    })),
    ...expenses.map(e => ({
      id: `expense-${e.ExpenseID}`,
      type: 'Expense',
      date: e.ExpenseDate,
      amount: Number(e.Amount),
      category: categoryMap.get(e.CategoryID || 0) || 'General',
      subcategory: subCategoryMap.get(e.SubCategoryID || 0) || '',
      project: projectMap.get(e.ProjectID || 0) || 'None',
      detail: e.ExpenseDetail || e.Description || 'No detail'
    }))
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const totalIncome = incomes.reduce((sum, i) => sum + Number(i.Amount), 0);
  const totalExpense = expenses.reduce((sum, e) => sum + Number(e.Amount), 0);

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="flex gap-6 items-center">
          <div className="w-20 h-20 rounded-3xl bg-brand-blue/10 flex items-center justify-center text-3xl border-2 border-brand-blue/20">
            {person.PeopleName.slice(0, 1).toUpperCase()}
          </div>
          <div>
            <h2 className="text-3xl font-bold text-text-primary">{person.PeopleName}</h2>
            <div className="flex gap-4 mt-1">
              <span className="text-text-secondary text-sm flex items-center gap-1">
                🆔 {person.PeopleCode || 'N/A'}
              </span>
              <span className="text-text-secondary text-sm flex items-center gap-1">
                📧 {person.Email}
              </span>
              <span className="text-text-secondary text-sm flex items-center gap-1">
                📱 {person.MobileNo}
              </span>
            </div>
          </div>
        </div>
        <Link 
          href="/peoples" 
          className="px-4 py-2 rounded-xl text-text-secondary font-medium hover:bg-slate-100 transition-all border border-border-light"
        >
          ← Back to Peoples
        </Link>
      </div>

      {/* Stats and Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="premium-card bg-emerald-50 border-emerald-100">
          <p className="text-emerald-700 font-bold text-xs uppercase tracking-widest mb-1">Total Generated Income</p>
          <h3 className="text-3xl font-black text-emerald-600">₹{totalIncome.toLocaleString()}</h3>
        </div>
        
        <div className="premium-card bg-red-50 border-red-100">
          <p className="text-red-700 font-bold text-xs uppercase tracking-widest mb-1">Total Personal Expenses</p>
          <h3 className="text-3xl font-black text-red-600">₹{totalExpense.toLocaleString()}</h3>
        </div>

        <div className="premium-card bg-brand-blue/5 border-brand-blue/10">
          <p className="text-brand-blue font-bold text-xs uppercase tracking-widest mb-1">Assigned Projects</p>
          <h3 className="text-3xl font-black text-brand-blue">{person.projects.length}</h3>
        </div>
      </div>

      {/* Content Tabs / Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Info & Projects */}
        <div className="lg:col-span-1 space-y-6">
          <div className="premium-card">
            <h4 className="text-lg font-bold text-text-primary mb-4 pb-2 border-b border-border-light">About User</h4>
            <p className="text-sm text-text-secondary leading-relaxed italic">
              {person.Description || "No additional description provided for this user."}
            </p>
            <div className="mt-6 pt-6 border-t border-border-light">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Member Since</p>
              <p className="text-sm font-medium text-text-primary">{new Date(person.Created).toLocaleDateString()}</p>
            </div>
          </div>

          <div className="premium-card">
            <h4 className="text-lg font-bold text-text-primary mb-4 pb-2 border-b border-border-light">Assigned Projects</h4>
            <div className="space-y-3">
              {person.projects.map(p => (
                <div key={p.ProjectID} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors cursor-default">
                  <div className="w-10 h-10 rounded-lg bg-white border border-border-light flex items-center justify-center text-xl shadow-sm">
                    {p.ProjectLogo || '💼'}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-text-primary">{p.ProjectName}</p>
                    <p className="text-[10px] font-medium text-emerald-600 uppercase tracking-tighter">Active Project</p>
                  </div>
                </div>
              ))}
              {person.projects.length === 0 && (
                <p className="text-sm text-text-secondary italic text-center py-4">No projects assigned.</p>
              )}
            </div>
          </div>
        </div>

        {/* Right: Transactions */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-border-light shadow-premium overflow-hidden">
             <div className="px-6 py-4 border-b border-border-light flex justify-between items-center">
                <h4 className="text-lg font-bold text-text-primary">Recent Transactions</h4>
                <span className="text-xs font-bold px-2 py-1 bg-slate-100 rounded-lg text-slate-500 uppercase">{allTransactions.length} Total</span>
             </div>
             <div className="overflow-x-auto">
                <table className="w-full text-left">
                   <thead>
                      <tr>
                         <th className="table-header">Date</th>
                         <th className="table-header">Details</th>
                         <th className="table-header">Amount</th>
                         <th className="table-header">Project</th>
                      </tr>
                   </thead>
                   <tbody>
                      {allTransactions.map((t, idx) => (
                         <tr key={idx} className="table-row">
                            <td className="px-6 py-4">
                               <p className="text-xs font-bold text-slate-500">{new Date(t.date).toISOString().split('T')[0]}</p>
                            </td>
                            <td className="px-6 py-4">
                               <p className="text-sm font-bold text-text-primary">{t.detail}</p>
                               <div className="flex gap-2 mt-1">
                                  <span className={t.type === 'Expense' ? 'badge-expense !text-[9px]' : 'badge-income !text-[9px]'}>
                                     {t.category}
                                  </span>
                                  {t.subcategory && (
                                     <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
                                        • {t.subcategory}
                                     </span>
                                  )}
                               </div>
                            </td>
                            <td className="px-6 py-4">
                               <p className={`text-sm font-black ${t.type === 'Expense' ? 'text-red-600' : 'text-emerald-600'}`}>
                                  {t.type === 'Expense' ? '-' : '+'} ₹{t.amount.toLocaleString()}
                               </p>
                            </td>
                            <td className="px-6 py-4">
                               <p className="text-xs font-bold text-brand-blue/70 italic">{t.project}</p>
                            </td>
                         </tr>
                      ))}
                      {allTransactions.length === 0 && (
                         <tr>
                            <td colSpan={4} className="px-6 py-12 text-center text-text-secondary italic">
                               No transactions found for this user.
                            </td>
                         </tr>
                      )}
                   </tbody>
                </table>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
