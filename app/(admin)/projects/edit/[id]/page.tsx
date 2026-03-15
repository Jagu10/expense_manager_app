import { EditProjectAction } from "@/app/(actions)/EditProjectAction";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const projectId = parseInt(id);

  if (isNaN(projectId)) return <h3>Invalid Project ID</h3>;

  const project = await prisma.projects.findUnique({
    where: { ProjectID: projectId },
    include: { assignedPeoples: true }
  });

  if (!project) return notFound();

  const peoples = await prisma.peoples.findMany({
    where: { IsActive: true, UserID: project.UserID },
    orderBy: { PeopleName: "asc" },
  });

  const assignedPeopleIds = project.assignedPeoples.map(p => p.PeopleID);

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-text-primary">✏️ Edit Project</h2>
        <p className="text-text-secondary text-sm">Update the details of this project.</p>
      </div>

      <div className="premium-card">
        <form action={EditProjectAction} className="space-y-6">
          <input type="hidden" name="projectId" value={project.ProjectID} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-text-primary">Project Name</label>
              <input
                name="projectName"
                required
                defaultValue={project.ProjectName}
                placeholder="e.g., Office Reno, New Venture..."
                className="w-full px-4 py-2 bg-slate-50 border border-border-light rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 transition-all font-medium"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-text-primary">Logo Emoji / Icon</label>
              <input
                name="projectLogo"
                defaultValue={project.ProjectLogo ?? ""}
                placeholder="e.g., 🚀, 🏢"
                className="w-full px-4 py-2 bg-slate-50 border border-border-light rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 transition-all font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-text-primary">Start Date</label>
              <input
                type="date"
                name="startDate"
                defaultValue={project.ProjectStartDate ? new Date(project.ProjectStartDate).toISOString().slice(0, 10) : ""}
                className="w-full px-4 py-2 bg-slate-50 border border-border-light rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 transition-all font-medium"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-text-primary">End Date</label>
              <input
                type="date"
                name="endDate"
                defaultValue={project.ProjectEndDate ? new Date(project.ProjectEndDate).toISOString().slice(0, 10) : ""}
                className="w-full px-4 py-2 bg-slate-50 border border-border-light rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 transition-all font-medium"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-text-primary">Project Details</label>
            <textarea
              name="detail"
              defaultValue={project.ProjectDetail ?? ""}
              placeholder="What is this project about?"
              rows={3}
              className="w-full px-4 py-2 bg-slate-50 border border-border-light rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 transition-all"
            />
          </div>

          <div className="space-y-3">
            <label className="text-sm font-semibold text-text-primary">Assign Users (Peoples)</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 p-4 bg-slate-50 border border-border-light rounded-xl max-h-48 overflow-y-auto">
              {peoples.map((person) => (
                <label key={person.PeopleID} className="flex items-center gap-2 cursor-pointer hover:bg-white p-2 rounded-lg transition-colors">
                  <input
                    type="checkbox"
                    name="peopleIds"
                    value={person.PeopleID}
                    defaultChecked={assignedPeopleIds.includes(person.PeopleID)}
                    className="w-4 h-4 rounded border-border-light text-brand-blue focus:ring-brand-blue/20"
                  />
                  <span className="text-sm font-medium text-text-secondary">{person.PeopleName}</span>
                </label>
              ))}
              {peoples.length === 0 && (
                <p className="text-xs text-text-secondary italic col-span-full">No active people found. Add them in the Peoples section.</p>
              )}
            </div>
          </div>


          <div className="pt-4 border-t border-border-light flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input type="checkbox" name="isActive" defaultChecked={project.IsActive ?? false} className="w-4 h-4 rounded border-border-light text-brand-blue focus:ring-brand-blue/20" />
              <span className="text-sm font-medium text-text-secondary group-hover:text-text-primary transition-colors">Project is Active</span>
            </label>

            <div className="flex gap-3">
              <Link href="/projects" className="px-6 py-2 rounded-xl text-text-secondary font-medium hover:bg-slate-100 transition-all">
                Cancel
              </Link>
              <button type="submit" className="bg-brand-blue text-white px-8 py-2 rounded-xl hover:bg-brand-blue/90 transition-all font-bold shadow-sm shadow-brand-blue/20">
                Update Project
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
