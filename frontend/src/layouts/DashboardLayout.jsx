import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import { useLocation } from 'react-router-dom';

const PAGE_TITLES = {
  '/dashboard': 'Dashboard',
  '/manager': 'Manager Overview',
  '/hr': 'HR Overview',
  '/admin': 'Admin Overview',
  '/profile': 'My Profile',
  '/leave': 'My Leave',
  '/leave/approvals': 'Leave Approvals',
  '/leave/history': 'Leave History',
  '/employees': 'Employees',
  '/payslips': 'My payslips',
  '/announcements': 'Announcements',
  '/audit': 'Audit Log'
};

const DashboardLayout = () => {
  const { pathname } = useLocation();
  const title = PAGE_TITLES[pathname] || 'StaffPortal KE';
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className='flex h-screen bg-gray-50 overflow-hidden'>
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className='fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden'
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content */}
      <div className='flex-1 flex flex-col md:ml-56 overflow-hidden'>
        {/* Topbar */}
        <Topbar title={title} onMenuClick={() => setSidebarOpen(true)} />

        {/* Scrollable page content */}
        <main className='flex-1 overflow-y-auto p-4 md:p-6'>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
