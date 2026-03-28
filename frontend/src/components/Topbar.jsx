import RoleBadge from './RoleBadge';
import useAuthStore from '../store/authStore';
import { formatFullDate } from '../utils/formatDate';

const Topbar = ({ title }) => {
  const user = useAuthStore((state) => state.user);
  const today = formatFullDate(new Date());

  return (
    <header className='h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6'>
      {/* Left - page title */}
      <div>
        <h2 className='text-lg font-bold text-gray-800'>{title}</h2>
        <p className='text-xs text-gray-400'>{today}</p>
      </div>

      {/* Right - user info */}
      <div className='flex items-center gap-3'>
        <RoleBadge role={user?.role} />
        <div className='text-right'>
          <p className='text-sm font-semibold text-gray-700'>
            {user?.firstName} {user?.lastName}
          </p>
          <p className='text-xs text-gray-400'>{user?.department}</p>
        </div>
        <div className='w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm'>
          {user?.firstName?.[0]?.toUpperCase()}
          {user?.lastName?.[0]?.toUpperCase()}
        </div>
      </div>
    </header>
  );
};

export default Topbar;
