import { loginUser } from '@/app/(actions)/AuthActions';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-bg-main p-6">
      <div className="w-full max-w-[420px] space-y-8">
        {/* Logo Section */}
        <div className="flex flex-col items-center gap-3">
          <div className="w-16 h-16 bg-brand-blue rounded-3xl flex items-center justify-center text-white text-4xl shadow-lg shadow-brand-blue/20">
            👛
          </div>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-text-primary tracking-tight">LedgerFlow</h1>
            <p className="text-text-secondary font-medium">Welcome back to your finances</p>
          </div>
        </div>

        {/* Login Card */}
        <div className="premium-card !p-8 shadow-xl">
          <form action={loginUser} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-text-primary">Email Address</label>
              <input
                type="email"
                name="email"
                placeholder="alex@example.com"
                className="w-full px-4 py-3 bg-slate-50 border border-border-light rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 transition-all font-medium"
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-semibold text-text-primary">Password</label>
                <button type="button" className="text-xs font-bold text-brand-blue hover:underline">Forgot?</button>
              </div>
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-slate-50 border border-border-light rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 transition-all font-medium"
                required
              />
            </div>

            <button className="w-full bg-brand-blue text-white py-4 rounded-2xl hover:bg-brand-blue/90 transition-all font-bold text-lg shadow-lg shadow-brand-blue/20">
              Sign In
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-border-light text-center">
            <p className="text-text-secondary text-sm font-medium">
              Don't have an account?{" "}
              <Link href="/register" className="text-brand-blue font-bold hover:underline">
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
