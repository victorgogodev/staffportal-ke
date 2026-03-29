import RoleBadge from './RoleBadge';
import useAuthStore from '../store/authStore';
import { formatFullDate } from '../utils/formatDate';

const Topbar = ({ title, onMenuClick }) => {
  const user = useAuthStore((state) => state.user);
  const today = formatFullDate(new Date());

  return (
    <header className='h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-6 shrink-0'>
      {/* Left — hamburger + page title */}
      <div className='flex items-center gap-3'>
        {/* Hamburger — mobile only */}
        <button
          onClick={onMenuClick}
          className='md:hidden text-gray-500 hover:text-gray-700 p-1'
        >
          <svg
            width='20'
            height='20'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
          >
            <line x1='3' y1='6' x2='17' y2='6' />
            <line x1='3' y1='11' x2='17' y2='11' />
            <line x1='3' y1='16' x2='17' y2='16' />
          </svg>
        </button>
      </div>
      <div>
        <h2 className='text-base md:text-lg font-bold text-gray-800'>
          {title}
        </h2>
        <p className='text-xs text-gray-400 hidden md:block'>{today}</p>
      </div>

      {/* Right - user info */}
      <div className='flex items-center gap-2 md:gap-3'>
        <RoleBadge role={user?.role} />
        <div className='text-right hidden md:block'>
          <p className='text-sm font-semibold text-gray-700'>
            {user?.firstName} {user?.lastName}
          </p>
          <p className='text-xs text-gray-400'>{user?.department}</p>
        </div>
        <div className='w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm shrink-0'>
          {user?.firstName?.[0]?.toUpperCase()}
          {user?.lastName?.[0]?.toUpperCase()}
        </div>
      </div>
    </header>
  );
};

export default Topbar;
