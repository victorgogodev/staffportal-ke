import { useState, useEffect, useRef } from 'react';
import { Bell } from 'lucide-react';
import notificationService from '../services/notificationService';
import { formatRelative } from '../utils/formatDate';

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const unread = notifications.filter((n) => !n.read).length;

  const fetchNotifications = async () => {
    try {
      const data = await notificationService.getNotifications();
      setNotifications(data);
    } catch (err) {
      console.error('Failed to fetch notifications.', err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleOpen = () => setOpen((prev) => !prev);

  const handleMarkAllRead = async () => {
    await notificationService.markAllRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleMarkOneRead = async (id) => {
    await notificationService.markOneRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  return (
    <div className='relative' ref={ref}>
      {/* Bell button */}
      <button
        onClick={handleOpen}
        className='relative p-2 rounded-full hover:bg-gray-100 transition-colors'
      >
        <Bell size={20} className='text-gray-600' />
        {unread > 0 && (
          <span className='absolute top-1 right-1 bg-red-500 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center leading-none'>
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className='absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-100 z-50'>
          {/* Header */}
          <div className='flex items-center justify-between px-4 py-3 border-b border-gray-100'>
            <span className='font-semibold text-gray-800 text-sm'>
              Notifications
            </span>
            {unread > 0 && (
              <button
                onClick={handleMarkAllRead}
                className='text-xs text-blue-600 hover:underline'
              >
                Mark all as read
              </button>
            )}
          </div>

          {/* List */}
          <ul className='max-h-72 overflow-y-auto divide-y divide-gray-50'>
            {notifications.length === 0 ? (
              <li className='px-4 py-6 text-center text-sm text-gray-400'>
                No notifications yet
              </li>
            ) : (
              notifications.map((n) => (
                <li
                  key={n.id}
                  onClick={() => !n.read && handleMarkOneRead(n.id)}
                  className={`px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors ${!n.read ? 'bg-blue-50' : ''}`}
                >
                  <p
                    className={`text-sm ${!n.read ? 'font-semibold text-gray-800' : 'text-gray-600'}`}
                  >
                    {n.title}
                  </p>
                  <p className='text-xs text-gray-500 mt-0.5'>{n.message}</p>
                  <p className='text-xs text-gray-400 mt-1'>
                    {formatRelative(n.createdAt)}
                  </p>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
