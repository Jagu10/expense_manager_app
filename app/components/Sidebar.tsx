"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { logoutAction } from '@/app/(actions)/logout';

interface SidebarProps {
  role: 'admin' | 'user';
  userName?: string;
  profileImage?: string | null;
}

const Sidebar = ({ role, userName, profileImage }: SidebarProps) => {
  const pathname = usePathname();
  const adminMenu = [
    { name: 'Admin Board', href: '/dashboard', icon: '🛡️' },
    { name: 'Transactions', href: '/transactions', icon: '📋' },
    { name: 'Categories', href: '/categories', icon: '🏷️' },
    { name: 'Sub Categories', href: '/subcategories', icon: '📁' },
    { name: 'Projects', href: '/projects', icon: '📊' },
    { name: 'Reports', href: '/reports', icon: '📈' },
    { name: 'Export', href: '/export', icon: '📤' },
    { name: 'Peoples', href: '/peoples', icon: '👥' },
    { name: 'Settings', href: '/settings', icon: '⚙️' },
  ];

  const userMenu = [
    { name: 'My Dashboard', href: '/dashboarduser', icon: '👤' },
    { name: 'My Projects', href: '/projects', icon: '📊' },
    { name: 'My Transactions', href: '/transactions', icon: '📋' },
    { name: 'My Reports', href: '/reports', icon: '📈' },
    { name: 'Settings', href: '/settings', icon: '⚙️' },
  ];

  const menuItems = role === 'admin' ? adminMenu : userMenu;

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-gradient-to-b from-brand-sidebar to-sidebar-gradient-to shadow-sidebar z-50 flex flex-col border-r border-white/5">
      <div className="p-8 pb-6">
        <div className="flex items-center gap-4 mb-2">
          <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center border-2 border-white/30 overflow-hidden shadow-inner backdrop-blur-md">
            {profileImage ? (
              <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <span className="text-white font-bold text-lg">
                {userName?.slice(0, 1).toUpperCase() || "👤"}
              </span>
            )}
          </div>
          <div>
            <p className="text-white font-bold text-lg tracking-tight leading-tight">LedgerFlow</p>
            <p className="text-white/60 text-[10px] font-bold uppercase tracking-wider">{role === 'admin' ? 'Administrator' : 'Managed User'}</p>
          </div>
        </div>
        <div className="mt-4 px-1">
          <p className="text-white/80 text-sm font-medium truncate">Hello, {userName?.split(' ')[0]}</p>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-2 overflow-y-auto custom-scrollbar">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`sidebar-link ${isActive ? 'active' : ''}`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium text-white">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 mt-auto">
        <form action={logoutAction}>
          <button 
            type="submit"
            className="w-full flex items-center gap-3 px-4 py-3 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-all font-medium"
          >
            <span className="text-xl">🚪</span>
            <span>Sign Out</span>
          </button>
        </form>
      </div>
    </aside>
  );
};

export default Sidebar;
