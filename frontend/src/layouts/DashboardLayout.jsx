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
}

const DashboardLayout = () => {
  const { pathname } = useLocation();
  const title = PAGE_TITLES[pathname] || 'StaffPortal KE'

  return (
    <div className="flex h-screen bg-gray-50">

      {/* Fixed sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 flex flex-col ml-56 overflow-hidden">

        {/* Topbar */}
        <Topbar title={title} />

        {/* Scrollable page content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>

      </div>
    </div>
  );
}

export default DashboardLayout;