import { AddPeopleAction } from "@/app/(actions)/PeopleActions";
import Link from "next/link";

export default function AddPeoplePage() {
  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-text-primary">Add Person</h2>
        <p className="text-text-secondary text-sm">Add a new person to the system for tracking and access.</p>
      </div>

      <div className="premium-card">
        <form action={AddPeopleAction} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-text-primary">Full Name</label>
              <input
                name="peopleName"
                required
                placeholder="e.g., John Doe"
                className="w-full px-4 py-2 bg-slate-50 border border-border-light rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 transition-all placeholder:text-slate-400"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-text-primary">People Code</label>
              <input
                name="peopleCode"
                placeholder="e.g., JD001"
                className="w-full px-4 py-2 bg-slate-50 border border-border-light rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 transition-all placeholder:text-slate-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-text-primary">Email Address</label>
              <input
                type="email"
                name="email"
                required
                placeholder="john@example.com"
                className="w-full px-4 py-2 bg-slate-50 border border-border-light rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 transition-all placeholder:text-slate-400"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-text-primary">Mobile Number</label>
              <input
                name="mobileNo"
                required
                placeholder="+1 234 567 890"
                className="w-full px-4 py-2 bg-slate-50 border border-border-light rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 transition-all placeholder:text-slate-400"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-text-primary">Password</label>
            <input
              type="password"
              name="password"
              required
              placeholder="••••••••"
              className="w-full px-4 py-2 bg-slate-50 border border-border-light rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 transition-all placeholder:text-slate-400"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-text-primary">Description</label>
            <textarea
              name="description"
              placeholder="Short bio or notes about this person..."
              rows={3}
              className="w-full px-4 py-2 bg-slate-50 border border-border-light rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 transition-all placeholder:text-slate-400"
            />
          </div>

          <div className="pt-4 border-t border-border-light flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input type="checkbox" name="isActive" defaultChecked className="w-4 h-4 rounded border-border-light text-brand-blue focus:ring-brand-blue/20" />
              <span className="text-sm font-medium text-text-secondary group-hover:text-text-primary transition-colors">Mark as Active</span>
            </label>

            <div className="flex gap-3">
              <Link href="/peoples" className="px-6 py-2 rounded-xl text-text-secondary font-medium hover:bg-slate-100 transition-all">
                Cancel
              </Link>
              <button type="submit" className="bg-brand-blue text-white px-8 py-2 rounded-xl hover:bg-brand-blue/90 transition-all font-bold shadow-sm shadow-brand-blue/20">
                Save Person
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
