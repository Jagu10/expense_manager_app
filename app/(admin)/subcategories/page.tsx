import { deleteSubCategory } from "@/app/(actions)/DeleteSubCategoriesActions"
import { prisma } from "@/lib/prisma"
import Link from "next/link"

import { getSession } from "@/lib/auth"

export default async function SubCategories() {
  const session = await getSession();
  const isAdmin = session?.user?.role === "ADMIN";
  const adminId = session?.user?.adminId;

  const data = await prisma.sub_categories.findMany({
    where: { UserID: adminId },
    orderBy: { SubCategoryID: 'desc' }
  })

  const categories = await prisma.categories.findMany({
    where: { UserID: adminId }
  });
  const categoryMap = Object.fromEntries(categories.map(c => [c.CategoryID, c.CategoryName]));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">Sub Categories</h2>
          <p className="text-text-secondary text-sm">Fine-tune your expense and income tracking.</p>
        </div>
        <Link 
          href="/subcategories/add" 
          className="bg-brand-blue text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-brand-blue/90 transition-all font-medium shadow-sm"
        >
          <span className="text-xl">+</span> Add Sub Category
        </Link>
      </div>

      {/* Sub Categories Table */}
      <div className="bg-white rounded-2xl border border-border-light shadow-premium overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="table-header">Name</th>
                <th className="table-header">Parent Category</th>
                <th className="table-header">Type</th>
                <th className="table-header text-right px-6 w-32">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((s) => (
                <tr key={s.SubCategoryID} className="table-row">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-400">
                        {s.SubCategoryName.slice(0, 2).toUpperCase()}
                      </div>
                      <p className="font-semibold text-text-primary">{s.SubCategoryName}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-text-secondary bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                      {categoryMap[s.CategoryID] || `ID: ${s.CategoryID}`}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={s.IsExpense ? 'badge-expense' : 'badge-income'}>
                      {s.IsExpense ? "Expense" : "Income"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2 w-32 whitespace-nowrap">
                    <Link
                      href={`/subcategories/edit/${s.SubCategoryID}`}
                      className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-border-light text-brand-blue hover:bg-slate-50 transition-colors"
                      title="Edit"
                    >
                      ✏️
                    </Link>

                    <form
                      action={async()=>{
                        "use server"
                        await deleteSubCategory(s.SubCategoryID)
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
                    No subcategories found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}