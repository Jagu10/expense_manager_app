import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-bg-main overflow-hidden">
      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 pt-24 pb-32 text-center lg:text-left lg:flex items-center gap-12">
        <div className="flex-1 space-y-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-blue/10 text-brand-blue text-xs font-bold uppercase tracking-widest border border-brand-blue/20 animate-pulse">
            ✨ Premium Financial Management
          </div>
          
          <h1 className="text-6xl lg:text-8xl font-black text-text-primary leading-[1] tracking-tighter">
            Smart money <br />
            <span className="text-brand-blue">movements.</span>
          </h1>
          
          <p className="text-xl text-text-secondary max-w-xl mx-auto lg:mx-0 font-medium leading-relaxed">
            Experience the next generation of expense tracking. Elegant, fast, and engineered to give you total control over your wealth.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Link 
              href="/login" 
              className="px-10 py-5 bg-brand-blue text-white rounded-3xl font-black text-xl hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-brand-blue/30 text-center"
            >
              Get Started Now
            </Link>
            <Link 
              href="/register" 
              className="px-10 py-5 bg-white border-2 border-border-light text-text-primary rounded-3xl font-bold text-xl hover:bg-slate-50 transition-all text-center"
            >
              Join LedgerFlow
            </Link>
          </div>
          
          <div className="pt-8 flex items-center justify-center lg:justify-start gap-8 opacity-50 grayscale hover:grayscale-0 transition-all">
             <div className="text-sm font-bold tracking-tighter uppercase whitespace-nowrap">Integrated with</div>
             <div className="flex gap-6 text-2xl font-black">
                <span>PRISMA</span>
                <span>TAILWIND</span>
                <span>NEXTJS</span>
             </div>
          </div>
        </div>

        {/* Visual Element */}
        <div className="flex-1 mt-20 lg:mt-0 relative">
          <div className="absolute inset-0 bg-brand-blue/20 blur-[120px] rounded-full -z-10 animate-pulse"></div>
          <div className="premium-card !p-12 rotate-3 hover:rotate-0 transition-all duration-700 cursor-default shadow-3xl">
             <div className="w-20 h-20 bg-brand-blue rounded-3xl mb-8 flex items-center justify-center shadow-lg">
                <span className="text-white text-5xl font-bold italic">L</span>
             </div>
             <div className="space-y-6">
                <div className="h-6 bg-slate-100 rounded-full w-3/4"></div>
                <div className="h-6 bg-slate-100 rounded-full w-1/2"></div>
                <div className="h-24 bg-slate-50 rounded-3xl border border-dashed border-slate-200 flex items-center justify-center text-slate-300 font-bold uppercase tracking-widest text-xs">
                   Dashboard Preview
                </div>
                <div className="flex gap-3">
                   <div className="w-12 h-12 rounded-full bg-emerald-100"></div>
                   <div className="w-12 h-12 rounded-full bg-red-100"></div>
                   <div className="w-12 h-12 rounded-full bg-brand-blue/20"></div>
                </div>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
}