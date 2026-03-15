import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { DeletePeopleAction } from "@/app/(actions)/PeopleActions";
import { getSession } from "@/lib/auth";

export default async function PeoplesPage() {
  const session = await getSession();
  const adminId = session?.user?.adminId;

  const data = await prisma.peoples.findMany({
    where: { UserID: adminId },
    orderBy: { PeopleID: "desc" },
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">System Peoples</h2>
          <p className="text-text-secondary text-sm">Manage system people and their access details.</p>
        </div>
        <Link 
          href="/peoples/add" 
          className="bg-brand-blue text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-brand-blue/90 transition-all font-medium shadow-sm"
        >
          <span className="text-xl">+</span> Add Person
        </Link>
      </div>

      {/* Peoples Table */}
      <div className="bg-white rounded-2xl border border-border-light shadow-premium overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="table-header">Name</th>
                <th className="table-header">Code</th>
                <th className="table-header">Email & Mobile</th>
                <th className="table-header">Status</th>
                <th className="table-header text-right px-6 w-32">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((p) => (
                <tr key={p.PeopleID} className="table-row">
                  <td className="px-6 py-4">
                    <p className="font-semibold text-text-primary">{p.PeopleName}</p>
                    <p className="text-xs text-text-secondary">{p.Description}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-mono text-sm bg-slate-50 px-2 py-1 rounded border border-slate-100">
                      {p.PeopleCode || 'N/A'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-text-primary">{p.Email}</p>
                    <p className="text-xs text-text-secondary">{p.MobileNo}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded ${p.IsActive ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                      {p.IsActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2 w-32 whitespace-nowrap">
                    <Link
                      href={`/peoples/view/${p.PeopleID}`}
                      className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-border-light text-slate-500 hover:bg-slate-50 hover:text-brand-blue transition-colors"
                      title="View Details"
                    >
                      👁️
                    </Link>
                    <Link
                      href={`/peoples/edit/${p.PeopleID}`}
                      className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-border-light text-brand-blue hover:bg-slate-50 transition-colors"
                      title="Edit"
                    >
                      ✏️
                    </Link>

                    <form
                      action={async () => {
                        "use server";
                        await DeletePeopleAction(p.PeopleID);
                      }}
                      className="inline"
                    >
                      <button 
                        className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-border-light text-red-500 hover:bg-red-50 hover:border-red-100 transition-colors"
                        title="Delete"
                      >
                        🗑️
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
              {data.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-text-secondary italic">
                    No peoples found. Start by adding one!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
