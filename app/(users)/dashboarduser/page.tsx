import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { getSession } from "@/lib/auth";

export default async function UserDashboard() {
  const session = await getSession();
  const userId = session?.user?.id;

  // Total Income
  const totalIncome = await prisma.incomes.aggregate({
    where: { PeopleID: userId },
    _sum: { Amount: true },
  });

  // Total Expense
  const totalExpense = await prisma.expenses.aggregate({
    where: { PeopleID: userId },
    _sum: { Amount: true },
  });

  // Recent Transactions (Income + Expense)
  const recentIncome = await prisma.incomes.findMany({
    where: { PeopleID: userId },
    take: 5,
    orderBy: { IncomeDate: "desc" },
  });

  const recentExpense = await prisma.expenses.findMany({
    where: { PeopleID: userId },
    take: 5,
    orderBy: { ExpenseDate: "desc" },
  });

  const income = Number(totalIncome._sum.Amount ?? 0);
  const expense = Number(totalExpense._sum.Amount || 0);
  const balance = income - expense;

  const allTransactions = [
    ...recentIncome.map(i => ({ type: 'Income', detail: i.Description, amount: Number(i.Amount), date: i.IncomeDate })),
    ...recentExpense.map(e => ({ type: 'Expense', detail: e.ExpenseDetail, amount: Number(e.Amount), date: e.ExpenseDate }))
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Monthly Summary (Current Month)
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const monthlyIncome = await prisma.incomes.aggregate({
    where: { 
      PeopleID: userId,
      IncomeDate: { gte: startOfMonth } 
    },
    _sum: { Amount: true },
  });

  const monthlyExpense = await prisma.expenses.aggregate({
    where: { 
      PeopleID: userId,
      ExpenseDate: { gte: startOfMonth } 
    },
    _sum: { Amount: true },
  });

  const monthlySummary = Number(monthlyIncome._sum.Amount ?? 0) - Number(monthlyExpense._sum.Amount ?? 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">👋 Welcome Back</h2>
          <p className="text-text-secondary text-sm">Here's what's happening with your money today.</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="premium-card">
          <p className="text-text-secondary font-medium mb-1">My Income</p>
          <h3 className="text-3xl font-bold text-emerald-600">₹{income.toLocaleString()}</h3>
        </div>

        <div className="premium-card">
          <p className="text-text-secondary font-medium mb-1">My Expenses</p>
          <h3 className="text-3xl font-bold text-red-600">₹{expense.toLocaleString()}</h3>
        </div>

      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 gap-6">
        <div className="bg-white rounded-2xl border border-border-light shadow-premium overflow-hidden">
          <div className="px-6 py-4 border-b border-border-light flex justify-between items-center bg-slate-50/50">
            <h5 className="font-bold text-text-primary">Recent Transactions</h5>
            <div className="flex gap-4">
              <Link href="/incomes" className="text-emerald-600 text-sm font-semibold hover:underline">View Incomes</Link>
              <Link href="/expenses" className="text-red-600 text-sm font-semibold hover:underline">View Expenses</Link>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr>
                  <th className="table-header">Date</th>
                  <th className="table-header">Detail</th>
                  <th className="table-header">Type</th>
                  <th className="table-header">Amount</th>
                </tr>
              </thead>
              <tbody>
                {allTransactions.map((t, idx) => (
                  <tr key={idx} className="table-row">
                    <td className="px-6 py-4 text-sm text-text-secondary">
                      {new Date(t.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 font-medium text-text-primary">
                      {t.detail}
                    </td>
                    <td className="px-6 py-4">
                      <span className={t.type === 'Expense' ? 'badge-expense' : 'badge-income'}>
                        {t.type}
                      </span>
                    </td>
                    <td className={`px-6 py-4 font-bold ${t.type === 'Expense' ? 'text-text-primary' : 'text-emerald-600'}`}>
                      {t.type === 'Expense' ? '-' : '+'} ₹{t.amount.toLocaleString()}
                    </td>
                  </tr>
                ))}
                {allTransactions.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-text-secondary italic">
                      No recent transactions found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
