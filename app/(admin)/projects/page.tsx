import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import Link from "next/link";

export default async function Projects() {
  const session = await getSession();
  const userId = session?.user?.id;
  const isAdmin = session?.user?.role === "ADMIN";

  let data;
  if (isAdmin) {
    data = await prisma.projects.findMany({
      where: { UserID: userId },
      orderBy: { ProjectID: 'desc' }
    });
  } else {
    data = await prisma.projects.findMany({
      where: {
        assignedPeoples: {
          some: {
            PeopleID: userId
          }
        },
        IsActive: true
      },
      orderBy: { ProjectID: 'desc' }
    });
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">{isAdmin ? "Projects" : "My Projects"}</h2>
          <p className="text-text-secondary text-sm">
            {isAdmin ? "Track your expenses by project or venture." : "Projects you are currently assigned to."}
          </p>
        </div>
        {isAdmin && (
          <Link 
            href="/projects/add" 
            className="bg-brand-blue text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-brand-blue/90 transition-all font-medium shadow-sm"
          >
            <span className="text-xl">+</span> Add Project
          </Link>
        )}
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.map((p) => (
          <div key={p.ProjectID} className="premium-card hover:border-brand-blue/30 transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-2xl bg-brand-blue/10 flex items-center justify-center text-2xl">
                {p.ProjectLogo || '💼'}
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded bg-slate-100 text-slate-500 ${p.IsActive ? 'bg-emerald-50 text-emerald-600' : ''}`}>
                {p.IsActive ? 'Active' : 'Inactive'}
              </span>
            </div>
            
            <h4 className="text-lg font-bold text-text-primary mb-2 group-hover:text-brand-blue transition-colors">
              {p.ProjectName}
            </h4>
            
            <p className="text-sm text-text-secondary line-clamp-2 mb-6 h-10">
              {p.ProjectDetail || 'No detailed description provided for this project.'}
            </p>

            <div className="flex justify-between items-center pt-4 border-t border-border-light">
              <div className="text-xs text-text-secondary">
                <p className="font-semibold uppercase text-[9px] tracking-tighter">Timeline (Start - End)</p>
                <p>{p.ProjectStartDate ? new Date(p.ProjectStartDate).toLocaleDateString() : 'N/A'} - {p.ProjectEndDate ? new Date(p.ProjectEndDate).toLocaleDateString() : 'N/A'}</p>
              </div>
              <div className="flex gap-2">
                {isAdmin && (
                  <>
                    <Link 
                      href={`/projects/edit/${p.ProjectID}`}
                      className="p-2 rounded-lg hover:bg-slate-100 text-brand-blue transition-colors"
                    >
                      ✏️
                    </Link>
                    <form
                      action={async () => {
                        "use server";
                        const { DeleteProjectAction } = await import("@/app/(actions)/DeleteProjectAction");
                        await DeleteProjectAction(p.ProjectID);
                      }}
                      className="inline"
                    >
                      <button 
                        className="p-2 rounded-lg hover:bg-red-50 text-red-500 transition-colors"
                        title="Delete"
                      >
                        🗑️
                      </button>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
        {data.length === 0 && (
          <div className="col-span-full py-12 premium-card text-center border-dashed border-2 border-slate-200 bg-slate-50/50">
            <p className="text-text-secondary italic">No projects found. Launch your first project!</p>
          </div>
        )}
      </div>
    </div>
  );
}
