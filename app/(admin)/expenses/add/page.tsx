import { AddExpenseAction } from "@/app/(actions)/AddExpenseAction";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { getSession } from "@/lib/auth";

export default async function AddExpensePage() {
  const session = await getSession();
  const isAdmin = session?.user?.role === "ADMIN";

  const [categories, peoples] = await Promise.all([
    prisma.categories.findMany({
      where: { IsExpense: true, IsActive: true },
      orderBy: { Sequence: "asc" },
      select: { CategoryID: true, CategoryName: true },
    }),
    isAdmin ? prisma.peoples.findMany({
      where: { IsActive: true },
      orderBy: { PeopleName: "asc" },
      select: { PeopleID: true, PeopleName: true }
    }) : Promise.resolve([])
  ]);

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-text-primary">Add Expense</h2>
        <p className="text-text-secondary text-sm">Log your spending to keep your budget on track.</p>
      </div>

      <div className="premium-card">
        <form action={AddExpenseAction} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-text-primary">Date</label>
              <input 
                type="date" 
                name="expenseDate" 
                className="w-full px-4 py-2 bg-slate-50 border border-border-light rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 transition-all font-medium" 
                required 
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-text-primary">Category</label>
              <select 
                name="categoryId" 
                className="w-full px-4 py-2 bg-slate-50 border border-border-light rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 transition-all font-medium" 
                required
              >
                <option value="">Select Category</option>
                {categories.map((c) => (
                  <option key={c.CategoryID} value={c.CategoryID}>
                    {c.CategoryName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-text-primary">Amount (₹)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                <input 
                  type="number" 
                  name="amount" 
                  placeholder="0.00"
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-border-light rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 transition-all font-bold text-text-primary placeholder:font-normal" 
                  required 
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-text-primary">Attachment Name/Path</label>
              <input 
                type="text" 
                name="attachmentPath" 
                placeholder="Optional receipt path"
                className="w-full px-4 py-2 bg-slate-50 border border-border-light rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 transition-all text-sm" 
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-text-primary">Details / Description</label>
            <textarea 
              name="expenseDetail" 
              placeholder="What was this expense for?" 
              rows={3}
              className="w-full px-4 py-2 bg-slate-50 border border-border-light rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 transition-all placeholder:text-slate-400"
            />
          </div>

          {isAdmin && (
            <div className="space-y-2">
              <label className="text-sm font-semibold text-text-primary">Assign to Person</label>
              <select 
                name="peopleId" 
                className="w-full px-4 py-2 bg-slate-50 border border-border-light rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 transition-all font-medium" 
                required
              >
                <option value="">Select Person</option>
                {peoples.map((p) => (
                  <option key={p.PeopleID} value={p.PeopleID}>
                    {p.PeopleName}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="pt-6 border-t border-border-light flex justify-end gap-3">
            <Link href="/expenses" className="px-6 py-2 rounded-xl text-text-secondary font-medium hover:bg-slate-100 transition-all">
              Cancel
            </Link>
            <button type="submit" className="bg-red-600 text-white px-10 py-2 rounded-xl hover:bg-red-700 transition-all font-bold shadow-sm shadow-red-600/20 flex items-center gap-2">
               💾 Save Expense
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
