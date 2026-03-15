import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { getSession } from "@/lib/auth";

export default async function UserDashboard() {
  const session = await getSession();
  const adminId = session?.user?.adminId;

  const totalUsers = await prisma.peoples.count({
    where: { UserID: adminId }
  });

  const totalIncome = await prisma.incomes.aggregate({
    where: { UserID: adminId },
    _sum: { Amount: true }
  });

  const totalExpense = await prisma.expenses.aggregate({
    where: { UserID: adminId },
    _sum: { Amount: true }
  });

  const [incomes, expenses, projects, peoples, categories] = await Promise.all([
    prisma.incomes.findMany({
      where: { UserID: adminId },
      orderBy: { Created: 'desc' },
      take: 10
    }),
    prisma.expenses.findMany({
      where: { UserID: adminId },
      orderBy: { Created: 'desc' },
      take: 10
    }),
    prisma.projects.findMany({ where: { UserID: adminId } }),
    prisma.peoples.findMany({ where: { UserID: adminId } }),
    prisma.categories.findMany({ where: { UserID: adminId } })
  ]);

  const projectMap = new Map(projects.map(p => [p.ProjectID, p.ProjectName]));
  const peopleMap = new Map(peoples.map(p => [p.PeopleID, p.PeopleName]));
  const categoryMap = new Map(categories.map(c => [c.CategoryID, c.CategoryName]));

  const transactions = [
    ...incomes.map(i => ({
      id: `income-${i.IncomeID}`,
      type: 'Income',
      category: categoryMap.get(i.CategoryID || 0) || 'General',
      amount: Number(i.Amount),
      date: i.IncomeDate,
      project: projectMap.get(i.ProjectID || 0) || 'None',
      userName: peopleMap.get(i.PeopleID) || 'Unknown'
    })),
    ...expenses.map(e => ({
      id: `expense-${e.ExpenseID}`,
      type: 'Expense',
      category: categoryMap.get(e.CategoryID || 0) || 'General',
      amount: Number(e.Amount),
      date: e.ExpenseDate,
      project: projectMap.get(e.ProjectID || 0) || 'None',
      userName: peopleMap.get(e.PeopleID) || 'Unknown'
    }))
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());


  const income = Number(totalIncome._sum.Amount || 0);
  const expense = Number(totalExpense._sum.Amount || 0);
  const balance = income - expense;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">ADMIN DASHBORAD </h2>
        </div>
      </div>

      {/* Modern Filter Bar */}
      {/* <div className="bg-white p-4 rounded-2xl border border-border-light flex gap-4 items-center">
        <div className="flex-1 relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary">🔍</span>
          <input 
            type="text" 
            placeholder="Search by description or category..." 
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-border-light rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 transition-all"
          />
        </div>
        <select className="px-4 py-3 bg-slate-50 border border-border-light rounded-xl text-text-primary font-medium focus:outline-none">
          <option>All Types</option>
          <option>Income</option>
          <option>Expense</option>
        </select>
        <button className="p-3 bg-slate-50 border border-border-light rounded-xl hover:bg-slate-100 transition-colors">
          ⚙️
        </button>
        <button className="p-3 bg-slate-50 border border-border-light rounded-xl hover:bg-slate-100 transition-colors">
          📄
        </button>
      </div> */}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="premium-card">
          <p className="text-text-secondary font-medium mb-1">Total Income</p>
          <h3 className="text-3xl font-bold text-emerald-600">+₹{income.toLocaleString()}</h3>
        </div>

        <div className="premium-card">
          <p className="text-text-secondary font-medium mb-1">Total Expense</p>
          <h3 className="text-3xl font-bold text-red-600">-₹{expense.toLocaleString()}</h3>
        </div>

        <div className="premium-card">
          <p className="text-text-secondary font-medium mb-1">Total Users</p>
          <h3 className="text-3xl font-bold text-brand-blue">{totalUsers}</h3>
        </div>

        <div className="premium-card">
          <p className="text-text-secondary font-medium mb-1">Total Projects</p>
          <h3 className="text-3xl font-bold text-slate-700">{await prisma.projects.count({ where: { UserID: adminId } })}</h3>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-2xl border border-border-light shadow-premium overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="table-header">Date ↓</th>
                <th className="table-header">User</th>
                <th className="table-header">Category</th>
                <th className="table-header">Project</th>
                <th className="table-header">Amount</th>
              </tr>
            </thead>
            <tbody>
              
              {transactions.map(t => (
                <tr key={t.id} className="table-row">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <span className="text-slate-400">📅</span>
                      <div className="text-sm">
                        <p className="font-semibold text-text-primary">
                          {new Date(t.date).toISOString().split('T')[0]}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-semibold text-text-primary">{t.userName}</p>
                    <p className="text-xs text-text-secondary">{t.type}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={t.type === 'Expense' ? 'badge-expense' : 'badge-income'}>
                      {t.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-brand-blue italic">{t.project}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className={`text-lg font-bold ${t.type === 'Expense' ? 'text-text-primary' : 'text-emerald-600'}`}>
                      {t.type === 'Expense' ? '-' : '+'}₹{t.amount.toLocaleString()}
                    </p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
