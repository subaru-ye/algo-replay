import { Link, useLocation } from 'react-router-dom';
import { ClipboardList, LayoutDashboard } from 'lucide-react';

const links = [
  { to: '/', icon: LayoutDashboard, label: '每日看板' },
  { to: '/list', icon: ClipboardList, label: '全部题目' },
];

export function Layout({ children }) {
  const { pathname } = useLocation();
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center gap-6">
          <span className="font-bold text-lg">算法复盘</span>
          <div className="flex gap-1 ml-auto">
            {links.map(({ to, icon: Icon, label }) => (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  pathname === to ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Icon size={16} />
                {label}
              </Link>
            ))}
          </div>
        </div>
      </nav>
      <main className="max-w-5xl mx-auto px-4 py-6">{children}</main>
    </div>
  );
}
