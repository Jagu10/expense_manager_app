import { createSubCategory } from "@/app/(actions)/AddSubCategories"
import { prisma } from "@/lib/prisma"
import Link from "next/link"

export default async function AddSubCategory(){

  const categories = await prisma.categories.findMany({
    where:{IsActive:true},
    orderBy: { CategoryName: 'asc' }
  })

  return(
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-text-primary">Add Sub Category</h2>
        <p className="text-text-secondary text-sm">Create a more specific category for better financial breakdown.</p>
      </div>

      <div className="premium-card">
        <form action={createSubCategory} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-text-primary">Sub Category Name</label>
              <input 
                name="name" 
                required 
                placeholder="e.g., Vegetables, Bus Fare..."
                className="w-full px-4 py-2 bg-slate-50 border border-border-light rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-text-primary">Parent Category</label>
              <select name="categoryId" className="w-full px-4 py-2 bg-slate-50 border border-border-light rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 transition-all" required>
                <option value="">Select Category</option>
                {categories.map(c=>(
                  <option key={c.CategoryID} value={c.CategoryID}>
                    {c.CategoryName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-text-primary block">Transaction Type</label>
            <div className="flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="radio" name="type" value="expense" defaultChecked className="w-4 h-4 border-border-light text-brand-blue focus:ring-brand-blue/20" />
                <span className="text-sm text-text-secondary group-hover:text-text-primary transition-colors">Expense Item</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="radio" name="type" value="income" className="w-4 h-4 border-border-light text-brand-blue focus:ring-brand-blue/20" />
                <span className="text-sm text-text-secondary group-hover:text-text-primary transition-colors">Income Item</span>
              </label>
            </div>
          </div>

          <div className="pt-6 border-t border-border-light flex justify-end gap-3">
            <Link href="/subcategories" className="px-6 py-2 rounded-xl text-text-secondary font-medium hover:bg-slate-100 transition-all">
              Cancel
            </Link>
            <button type="submit" className="bg-brand-blue text-white px-10 py-2 rounded-xl hover:bg-brand-blue/90 transition-all font-bold shadow-sm shadow-brand-blue/20">
              Save Sub Category
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}