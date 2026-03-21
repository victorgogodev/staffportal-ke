import {
  LayoutDashboard,
  Users,
  CalendarDays,
  FileText,
  Megaphone,
  ClipboardList,
  Settings,
  History,
  Search
} from 'lucide-react';

const NAV_ITEMS = [
  {
    label: 'Dashboard',
    path: '/dashboard',
    icon: LayoutDashboard,
    allowedRoles: ['EMPLOYEE', 'MANAGER', 'HR', 'ADMIN']
  },
  {
    label: 'My Leave',
    path: '/leave',
    icon: CalendarDays,
    allowedRoles: ['EMPLOYEE', 'MANAGER', 'HR', 'ADMIN']
  },
  {
    label: 'Leave History',
    path: '/leave/history',
    icon: History,
    allowedRoles: ['EMPLOYEE', 'MANAGER', 'HR', 'ADMIN']
  },
  {
    label: 'Approve Leave',
    path: '/leave/approvals',
    icon: ClipboardList,
    allowedRoles: ['MANAGER', 'HR', 'ADMIN']
  },
  {
    label: 'Employees',
    path: '/employees',
    icon: Users,
    allowedRoles: ['HR', 'ADMIN']
  },
  {
    label: 'My Payslips',
    path: '/payslips',
    icon: FileText,
    allowedRoles: ['EMPLOYEE', 'MANAGER', 'HR', 'ADMIN']
  },
  {
    label: 'Announcements',
    path: '/announcements',
    icon: Megaphone,
    allowedRoles: ['HR', 'ADMIN']
  },
  {
    label: 'Audit Log',
    path: '/audit',
    icon: Search,
    allowedRoles: ['HR', 'ADMIN']
  },
  {
    label: 'Profile',
    path: '/profile',
    icon: Settings,
    allowedRoles: ['EMPLOYEE', 'MANAGER', 'HR', 'ADMIN']
  }
]

export const getNavItemsForRole = (role) => NAV_ITEMS.filter((item) => item.allowedRoles.includes(role));

export default NAV_ITEMS;