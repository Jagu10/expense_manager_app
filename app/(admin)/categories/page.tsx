import { DeleteCategoryAction } from "@/app/(actions)/DeleteCategoryAction";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import Link from "next/link";

export default async function CategoriesPage() {
  const session = await getSession();
  const isAdmin = session?.user?.role === "ADMIN";
  const adminId = session?.user?.adminId;

  const data = await prisma.categories.findMany({
    where: { UserID: adminId },
    orderBy: { CategoryID: "desc" },
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">Categories</h2>
          <p className="text-text-secondary text-sm">Manage your finance categories and their types.</p>
        </div>
        <Link 
          href="/categories/add" 
          className="bg-brand-blue text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-brand-blue/90 transition-all font-medium shadow-sm"
        >
          <span className="text-xl">+</span> Add Category
        </Link>
      </div>

      {/* Categories Table */}
      <div className="bg-white rounded-2xl border border-border-light shadow-premium overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="table-header">Category Name</th>
                <th className="table-header">Type</th>
                <th className="table-header">Status</th>
                <th className="table-header text-right px-6">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((c) => (
                <tr key={c.CategoryID} className="table-row">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {c.LogoPath ? (
                         <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-lg">
                           {c.LogoPath}
                         </div>
                      ) : (
                        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-400">
                          {c.CategoryName.slice(0, 2).toUpperCase()}
                        </div>
                      )}
                      <p className="font-semibold text-text-primary">{c.CategoryName}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                       {c.IsExpense && <span className="badge-expense">Expense</span>}
                       {c.IsIncome && <span className="badge-income">Income</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded ${c.IsActive ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                      {c.IsActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <Link
                      href={`/categories/edit/${c.CategoryID}`}
                      className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-border-light text-brand-blue hover:bg-slate-50 transition-colors"
                      title="Edit"
                    >
                      ✏️
                    </Link>

                    <form
                      action={async () => {
                        "use server";
                        await DeleteCategoryAction(c.CategoryID);
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
              {data.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-text-secondary italic">
                    No categories found. Start by adding one!
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
