import { NavLink, useNavigate } from 'react-router-dom';
import { getNavItemsForRole } from '../utils/roleConfig';
import useAuthStore from '../store/authStore';
import RoleBadge from './RoleBadge';

const Sidebar = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const navItems = getNavItemsForRole(user?.role);

  const handleLogout = () => {
    logout();
    navigate('/login');
  }

  return (
    <aside className="h-screen w-56 bg-slate-900 flex flex-col fixed left-0 top-0">

      {/* Brand */}
      <div className="px-5 py-5 border-b border-slate-700">
        <h1 className="text-white font-bold text-lg leading-tight">StaffPortal</h1>
        <p className="text-slate-400 text-xs mt-0.5">KE</p>
      </div>

      {/* User info */}
      <div className="px-5 py-4 border-b border-slate-700">
        <p className="text-white text-sm font-semibold truncate">
          {user?.firstName} {user?.lastName}
        </p>
        <p className="text-slate-400 text-xs truncate mb-2">{user?.email}</p>
        <RoleBadge role={user?.role} />
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <ul className="space-y-1">
          {navItems.map(({ label, path, icon: Icon }) => (
            <li key={path}>
              <NavLink
                to={path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${isActive
                    ? 'bg-blue-600 text-white font-semibold'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`
                }
              >
                <Icon size={17} />
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-slate-700">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-300 hover:bg-red-900 hover:text-red-300 transition-colors">
          <span className="text-base">⏻</span>
          Logout
        </button>
      </div>

    </aside>
  );
}

export default Sidebar;