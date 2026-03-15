import { DeleteIncomeAction } from "@/app/(actions)/DeleteIncomeAction";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { getSession } from "@/lib/auth";

export default async function IncomesPage() {
  const session = await getSession();
  const isAdmin = session?.user?.role === "ADMIN";
  const userId = session?.user?.id;

  const incomes = await prisma.incomes.findMany({
    where: isAdmin ? { UserID: userId } : { PeopleID: userId },
    orderBy: { IncomeDate: "desc" },
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">💰 Incomes</h2>
          <p className="text-text-secondary text-sm">Monitor your earnings and revenue streams.</p>
        </div>
        <Link 
          href="/incomes/add" 
          className="bg-emerald-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-emerald-700 transition-all font-medium shadow-sm"
        >
          <span className="text-xl">+</span> Add Income
        </Link>
      </div>

      {/* Incomes Table */}
      <div className="bg-white rounded-2xl border border-border-light shadow-premium overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="table-header">Date</th>
                <th className="table-header">Description</th>
                <th className="table-header">Amount</th>
                <th className="table-header text-right px-6">Actions</th>
              </tr>
            </thead>
            <tbody>
              {incomes.map((i) => (
                <tr key={i.IncomeID} className="table-row">
                  <td className="px-6 py-4 text-sm text-text-secondary">
                    {i.IncomeDate.toISOString().slice(0, 10)}
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-semibold text-text-primary">{i.Description || "No detail"}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-emerald-600">+ ₹{Number(i.Amount).toLocaleString()}</p>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <Link
                      href={`/incomes/edit/${i.IncomeID}`}
                      className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-border-light text-brand-blue hover:bg-slate-50 transition-colors"
                      title="Edit"
                    >
                      ✏️
                    </Link>

                    <form
                      action={async () => {
                        "use server";
                        await DeleteIncomeAction(i.IncomeID);
                      }}
                      className="inline"
                    >
                      <button 
                        className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-border-light text-red-500 hover:bg-red-50 hover:border-red-100 transition-colors"
                        title="Delete"
                      >
                        🗑️
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
              {incomes.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-text-secondary italic">
                    No income records found.
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
