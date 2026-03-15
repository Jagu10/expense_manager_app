import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import SettingsForm from "@/app/components/SettingsForm";

export default async function SettingsPage() {
  const session = await getSession();
  if (!session) return <div>Unauthorized</div>;

  const role = session.user.role;
  const userId = session.user.id;
  const isAdmin = role === "ADMIN";

  let userData: any;

  if (isAdmin) {
    userData = await prisma.users.findUnique({
      where: { UserID: userId },
    });
  } else {
    userData = await prisma.peoples.findUnique({
      where: { PeopleID: userId },
    });
  }

  const name = isAdmin ? userData?.UserName : userData?.PeopleName;
  const email = isAdmin ? userData?.EmailAddress : userData?.Email;
  const mobile = userData?.MobileNo || "";

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-text-primary">⚙️ Settings</h2>
        <p className="text-text-secondary text-sm">Manage your profile and account preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Profile Overview Card */}
        <div className="md:col-span-1">
          <div className="premium-card sticky top-8">
            <div className="flex flex-col items-center text-center p-4">
              <div className="w-24 h-24 rounded-full bg-brand-blue/10 flex items-center justify-center text-3xl mb-4 border-2 border-brand-blue/20">
                {name?.slice(0, 1).toUpperCase() || "👤"}
              </div>
              <h4 className="font-bold text-text-primary text-xl truncate w-full">{name}</h4>
              <p className="text-text-secondary text-sm mb-4 capitalize">{role.toLowerCase()}</p>
              <div className="w-full pt-4 border-t border-border-light text-left space-y-3">
                <div className="flex items-center gap-2 text-sm text-text-primary">
                  <span className="text-text-secondary">📧</span>
                  <span className="truncate">{email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-text-primary">
                  <span className="text-text-secondary">📱</span>
                  <span>{mobile || "Not set"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-border-light shadow-premium p-8">
            <h5 className="text-lg font-bold text-text-primary mb-6">Edit Profile</h5>
            <SettingsForm initialData={{ name, email, mobile }} />
          </div>
        </div>
      </div>
    </div>
  );
}
