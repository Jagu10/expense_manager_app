import { registerUser } from '@/app/(actions)/registreActions';
import Link from 'next/link';

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-bg-main p-6">
      <div className="w-full max-w-[450px] space-y-8">
        {/* Logo Section */}
        <div className="flex flex-col items-center gap-3">
          <div className="w-16 h-16 bg-emerald-600 rounded-3xl flex items-center justify-center text-white text-4xl shadow-lg shadow-emerald-600/20">
            📝
          </div>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-text-primary tracking-tight">Join LedgerFlow</h1>
            <p className="text-text-secondary font-medium">Start managing your wealth today</p>
          </div>
        </div>

        {/* Register Card */}
        <div className="premium-card !p-8 shadow-xl">
          <form action={registerUser} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-text-primary">Full Name</label>
              <input
                type="text"
                name="username"
                placeholder="Alex Rivera"
                className="w-full px-4 py-3 bg-slate-50 border border-border-light rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 transition-all font-medium"
                required
              />
            </div>

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
              <label className="text-sm font-semibold text-text-primary">Mobile Number</label>
              <input
                type="text"
                name="mobile"
                placeholder="+91 98765 43210"
                className="w-full px-4 py-3 bg-slate-50 border border-border-light rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 transition-all font-medium"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-text-primary">Create Password</label>
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-slate-50 border border-border-light rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 transition-all font-medium"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-text-primary">Select Role</label>
              <select
                name="role"
                className="w-full px-4 py-3 bg-slate-50 border border-border-light rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 transition-all font-medium appearance-none"
                required
              >
                <option value="USER">User (Personal Access)</option>
                <option value="ADMIN">Admin (Company Access)</option>
              </select>
            </div>

            <button className="w-full bg-emerald-600 text-white py-4 rounded-2xl hover:bg-emerald-700 transition-all font-bold text-lg shadow-lg shadow-emerald-600/20">
              Create My Account
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-border-light text-center">
            <p className="text-text-secondary text-sm font-medium">
              Already have an account?{" "}
              <Link href="/login" className="text-brand-blue font-bold hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
