import { UpdateCategoryAction } from "@/app/(actions)/UpdateCategoryAction";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const categoryid = Number(id);

  const category = await prisma.categories.findUnique({
    where: { CategoryID: categoryid },
  });

  if (!category) return notFound();

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-text-primary">Edit Category</h2>
        <p className="text-text-secondary text-sm">Update the details for "{category.CategoryName}".</p>
      </div>

      <div className="premium-card">
        <form action={UpdateCategoryAction} className="space-y-6">
          <input type="hidden" name="CategoryID" value={category.CategoryID} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-text-primary">Category Name</label>
              <input
                name="categoryName"
                defaultValue={category.CategoryName}
                required
                className="w-full px-4 py-2 bg-slate-50 border border-border-light rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-text-primary">Logo Emoji / Path</label>
              <input
                name="logoPath"
                defaultValue={category.LogoPath ?? ""}
                className="w-full px-4 py-2 bg-slate-50 border border-border-light rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-text-primary">Description</label>
            <textarea
              name="description"
              defaultValue={category.Description ?? ""}
              rows={3}
              className="w-full px-4 py-2 bg-slate-50 border border-border-light rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 transition-all"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-text-primary">Sequence Order</label>
              <input
                type="number"
                name="sequence"
                defaultValue={category.Sequence?.toString() ?? ""}
                className="w-full px-4 py-2 bg-slate-50 border border-border-light rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 transition-all"
              />
            </div>

            <div className="space-y-4 pt-2">
              <label className="text-sm font-semibold text-text-primary block">Transaction Types</label>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input 
                    type="radio" 
                    name="type" 
                    value="expense"
                    defaultChecked={category.IsExpense}
                    className="w-4 h-4 border-border-light text-brand-blue focus:ring-brand-blue/20" 
                  />
                  <span className="text-sm text-text-secondary group-hover:text-text-primary transition-colors">Expense</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input 
                    type="radio" 
                    name="type" 
                    value="income"
                    defaultChecked={category.IsIncome}
                    className="w-4 h-4 border-border-light text-brand-blue focus:ring-brand-blue/20" 
                  />
                  <span className="text-sm text-text-secondary group-hover:text-text-primary transition-colors">Income</span>
                </label>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-border-light flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input 
                type="checkbox" 
                name="isActive" 
                defaultChecked={category.IsActive}
                className="w-4 h-4 rounded border-border-light text-brand-blue focus:ring-brand-blue/20" 
              />
              <span className="text-sm font-medium text-text-secondary group-hover:text-text-primary transition-colors">Active Category</span>
            </label>

            <div className="flex gap-3">
              <Link href="/categories" className="px-6 py-2 rounded-xl text-text-secondary font-medium hover:bg-slate-100 transition-all">
                Cancel
              </Link>
              <button type="submit" className="bg-brand-blue text-white px-8 py-2 rounded-xl hover:bg-brand-blue/90 transition-all font-bold shadow-sm shadow-brand-blue/20">
                Update Category
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
