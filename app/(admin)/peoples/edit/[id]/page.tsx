import { UpdatePeopleAction } from "@/app/(actions)/PeopleActions";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function EditPeoplePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const peopleId = Number(id);

  const person = await prisma.peoples.findUnique({
    where: { PeopleID: peopleId },
  });

  if (!person) return notFound();

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-text-primary">Edit Person</h2>
        <p className="text-text-secondary text-sm">Update the details for "{person.PeopleName}".</p>
      </div>

      <div className="premium-card">
        <form action={UpdatePeopleAction} className="space-y-6">
          <input type="hidden" name="PeopleID" value={person.PeopleID} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-text-primary">Full Name</label>
              <input
                name="peopleName"
                defaultValue={person.PeopleName}
                required
                className="w-full px-4 py-2 bg-slate-50 border border-border-light rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 transition-all shadow-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-text-primary">People Code</label>
              <input
                name="peopleCode"
                defaultValue={person.PeopleCode ?? ""}
                className="w-full px-4 py-2 bg-slate-50 border border-border-light rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 transition-all shadow-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-text-primary">Email Address</label>
              <input
                type="email"
                name="email"
                defaultValue={person.Email}
                required
                className="w-full px-4 py-2 bg-slate-50 border border-border-light rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 transition-all shadow-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-text-primary">Mobile Number</label>
              <input
                name="mobileNo"
                defaultValue={person.MobileNo}
                required
                className="w-full px-4 py-2 bg-slate-50 border border-border-light rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 transition-all shadow-sm"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-text-primary">Password</label>
            <input
              type="password"
              name="password"
              defaultValue={person.Password}
              required
              className="w-full px-4 py-2 bg-slate-50 border border-border-light rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 transition-all shadow-sm"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-text-primary">Description</label>
            <textarea
              name="description"
              defaultValue={person.Description ?? ""}
              rows={3}
              className="w-full px-4 py-2 bg-slate-50 border border-border-light rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 transition-all shadow-sm"
            />
          </div>

          <div className="pt-4 border-t border-border-light flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input 
                type="checkbox" 
                name="isActive" 
                defaultChecked={person.IsActive ?? false}
                className="w-4 h-4 rounded border-border-light text-brand-blue focus:ring-brand-blue/20" 
              />
              <span className="text-sm font-medium text-text-secondary group-hover:text-text-primary transition-colors">Mark as Active</span>
            </label>

            <div className="flex gap-3">
              <Link href="/peoples" className="px-6 py-2 rounded-xl text-text-secondary font-medium hover:bg-slate-100 transition-all">
                Cancel
              </Link>
              <button type="submit" className="bg-brand-blue text-white px-8 py-2 rounded-xl hover:bg-brand-blue/90 transition-all font-bold shadow-sm shadow-brand-blue/20">
                Update Person
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
