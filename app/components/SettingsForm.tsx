"use client";

import { useActionState } from "react";
import { UpdateProfileAction } from "@/app/(actions)/UpdateProfileAction";

interface SettingsFormProps {
  initialData: {
    name: string;
    email: string;
    mobile: string;
  };
}

export default function SettingsForm({ initialData }: SettingsFormProps) {
  const [state, formAction, isPending] = useActionState(UpdateProfileAction, null);

  return (
    <form action={formAction} className="space-y-6">
      {state?.message && (
        <div className={`p-4 rounded-xl text-sm font-bold animate-in fade-in slide-in-from-top-2 duration-300 ${state.success ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
          {state.success ? "✅ " : "❌ "} {state.message}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-text-secondary">Full Name</label>
          <input
            name="name"
            type="text"
            defaultValue={initialData.name}
            className="w-full px-4 py-3 bg-slate-50 border border-border-light rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 transition-all font-medium"
            placeholder="Enter your name"
            disabled={isPending}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-text-secondary">Mobile Number</label>
          <input
            name="mobile"
            type="text"
            defaultValue={initialData.mobile}
            className="w-full px-4 py-3 bg-slate-50 border border-border-light rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 transition-all font-medium"
            placeholder="+91 00000 00000"
            disabled={isPending}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-text-secondary">Email Address</label>
        <input
          name="email"
          type="email"
          defaultValue={initialData.email}
          className="w-full px-4 py-3 bg-slate-50 border border-border-light rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 transition-all font-medium"
          placeholder="name@example.com"
          disabled={isPending}
        />
      </div>

      <div className="pt-4 border-t border-border-light">
        <h5 className="text-lg font-bold text-text-primary mb-6">Security</h5>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-text-secondary">Current Password</label>
            <input
              name="oldPassword"
              type="password"
              className="w-full px-4 py-3 bg-slate-50 border border-border-light rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 transition-all font-medium"
              placeholder="••••••••"
              disabled={isPending}
            />
            <p className="text-[10px] text-text-secondary italic">Required only if changing password.</p>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-text-secondary">New Password</label>
            <input
              name="password"
              type="password"
              className="w-full px-4 py-3 bg-slate-50 border border-border-light rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 transition-all font-medium"
              placeholder="••••••••"
              disabled={isPending}
            />
            <p className="text-[10px] text-text-secondary italic">Leave blank to keep current.</p>
          </div>
        </div>
      </div>

      <div className="pt-6">
        <button
          type="submit"
          disabled={isPending}
          className="w-full sm:w-auto px-8 py-3 bg-brand-blue text-white rounded-xl font-bold shadow-lg shadow-brand-blue/20 hover:bg-brand-blue/90 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isPending ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              Saving Changes...
            </>
          ) : (
            "Save Changes"
          )}
        </button>
      </div>
    </form>
  );
}
