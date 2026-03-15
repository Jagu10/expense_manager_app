import Sidebar from '@/app/components/Sidebar';
import { getSession } from '@/lib/auth';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  const role = session?.user?.role?.toLowerCase() as 'admin' | 'user' || 'user';
  const userName = session?.user?.name;

  return (
    <div className="flex min-h-screen bg-bg-main">
      <Sidebar role={role} userName={userName} />
      <main className="flex-1 ml-64 p-8">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
