"use client";

import { useState } from "react";
import { AddExpenseAction } from "../(actions)/AddExpenseAction";
import { AddIncomeAction } from "../(actions)/AddIncomeActions"; 
import { EditTransactionAction } from "../(actions)/EditTransactionAction";
import Link from "next/link";

interface Props {
  categories: any[];
  subCategories: any[];
  projects: any[];
  peoples: any[];
  initialData?: any;
}

export default function UnifiedTransactionForm({ categories, subCategories, projects, peoples, initialData }: Props) {
  const [type, setType] = useState<"Income" | "Expense">(initialData?.type || "Expense");

  const handleSubmit = async (formData: FormData) => {
    if (initialData) {
      await EditTransactionAction(formData);
    } else {
      if (type === "Expense") {
        await AddExpenseAction(formData);
      } else {
        await AddIncomeAction(formData);
      }
    }
  };

  return (
    <form action={handleSubmit} className="space-y-6">
      {initialData && (
        <input type="hidden" name="transactionId" defaultValue={initialData.id} />
      )}
      <input type="hidden" name="transactionType" value={type} />
      {/* Type Toggle */}
      <div className="flex p-1 bg-slate-100 rounded-2xl w-fit mb-8">
        <button
          type="button"
          onClick={() => setType("Expense")}
          className={`px-8 py-2.5 rounded-xl font-bold transition-all ${
            type === "Expense" 
              ? "bg-red-600 text-white shadow-lg" 
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          Expense
        </button>
        <button
          type="button"
          onClick={() => setType("Income")}
          className={`px-8 py-2.5 rounded-xl font-bold transition-all ${
            type === "Income" 
              ? "bg-emerald-600 text-white shadow-lg" 
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          Income
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-text-primary">Date</label>
          <input 
            type="date" 
            name={type === "Expense" ? "expenseDate" : "incomeDate"} 
            defaultValue={initialData?.date ? new Date(initialData.date).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10)}
            min={initialData ? undefined : new Date().toISOString().split('T')[0]}
            className="w-full px-4 py-2 bg-slate-50 border border-border-light rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 transition-all font-medium" 
            required 
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-text-primary">Amount (₹)</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
            <input 
              type="number" 
              name="amount" 
              placeholder="0.00"
              step="0.01"
              min="0.01"
              defaultValue={initialData?.amount}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-border-light rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 transition-all font-bold text-text-primary" 
              required 
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-text-primary">Category</label>
          <select 
            name="categoryId" 
            defaultValue={initialData?.categoryId || ""}
            className="w-full px-4 py-2 bg-slate-50 border border-border-light rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 transition-all font-medium" 
            required
          >
            <option value="">Select Category</option>
            {categories.filter(c => type === "Expense" ? c.IsExpense : c.IsIncome).map((c) => (
              <option key={c.CategoryID} value={c.CategoryID}>
                {c.CategoryName}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-text-primary">Sub Category</label>
          <select 
            name="subCategoryId" 
            defaultValue={initialData?.subCategoryId || ""}
            className="w-full px-4 py-2 bg-slate-50 border border-border-light rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 transition-all font-medium" 
          >
            <option value="">Select Sub Category</option>
            {subCategories.filter(sc => type === "Expense" ? sc.IsExpense : sc.IsIncome).map((sc) => (
              <option key={sc.SubCategoryID} value={sc.SubCategoryID}>
                {sc.SubCategoryName}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-text-primary">Project</label>
          <select 
            name="projectId" 
            defaultValue={initialData?.projectId || ""}
            className="w-full px-4 py-2 bg-slate-50 border border-border-light rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 transition-all font-medium" 
            required
          >
            <option value="">Select Project</option>
            {projects.map((p) => (
              <option key={p.ProjectID} value={p.ProjectID}>
                {p.ProjectName}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-text-primary">Person</label>
          <select 
            name="peopleId" 
            defaultValue={initialData?.peopleId || ""}
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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-text-primary">Attachment</label>
          <input 
            type="file" 
            name="attachment" 
            className="w-full px-4 py-2 bg-slate-50 border border-border-light rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 transition-all font-medium"
          />
          {initialData?.attachmentPath && (
            <p className="text-xs text-brand-blue font-medium mt-1">Current: {initialData.attachmentPath}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-text-primary">Remarks</label>
          <textarea 
            name={type === "Expense" ? "expenseDetail" : "description"} 
            defaultValue={type === "Expense" ? initialData?.expenseDetail : initialData?.description}
            placeholder="What was this for?" 
            rows={1}
            className="w-full px-4 py-2 bg-slate-50 border border-border-light rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 transition-all"
          />
        </div>
      </div>

      <div className="pt-6 border-t border-border-light flex justify-end gap-3">
        <Link href="/transactions" className="px-6 py-2 rounded-xl text-text-secondary font-medium hover:bg-slate-100 transition-all">
          Cancel
        </Link>
        <button 
          type="submit" 
          className={`px-10 py-2 rounded-xl text-white font-bold shadow-sm transition-all flex items-center gap-2 ${
            type === "Expense" ? "bg-red-600 hover:bg-red-700 shadow-red-600/20" : "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20"
          }`}
        >
          💾 Save {type}
        </button>
      </div>
    </form>
  );
}
