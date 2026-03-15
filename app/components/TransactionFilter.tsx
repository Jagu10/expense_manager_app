"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function TransactionFilter({ initialType }: { initialType: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const currentSort = searchParams.get("sort") || "date-desc";

  // Debounced search
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (searchTerm) {
        params.set("search", searchTerm);
      } else {
        params.delete("search");
      }
      router.push(`${pathname}?${params.toString()}`);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, pathname, router, searchParams]);

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("type", e.target.value);
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", e.target.value);
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="bg-white p-4 rounded-2xl border border-border-light flex flex-col md:flex-row gap-4 items-center">
      <div className="flex-1 w-full relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary">🔍</span>
        <input 
          type="text" 
          placeholder="Search by description or category..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-border-light rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 transition-all"
        />
      </div>
      <div className="flex gap-2 w-full md:w-auto">
        <select 
          value={initialType}
          onChange={handleTypeChange}
          className="flex-1 md:flex-none px-4 py-3 bg-slate-50 border border-border-light rounded-xl text-text-primary font-medium focus:outline-none"
        >
          <option value="All">All Types</option>
          <option value="Income">Income</option>
          <option value="Expense">Expense</option>
        </select>
        <select 
          value={currentSort}
          onChange={handleSortChange}
          className="flex-1 md:flex-none px-4 py-3 bg-slate-50 border border-border-light rounded-xl text-text-primary font-medium focus:outline-none"
        >
          <option value="date-desc">Newest First</option>
          <option value="date-asc">Oldest First</option>
          <option value="amount-desc">Highest Amount</option>
          <option value="amount-asc">Lowest Amount</option>
        </select>
      </div>
    </div>
  );
}
