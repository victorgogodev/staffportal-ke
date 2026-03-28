const ROLE_STYLES = {
  EMPLOYEE: 'bg-blue-100 text-blue-700',
  MANAGER: 'bg-purple-100 text-purple-700',
  HR: 'bg-green-100 text-green-700',
  ADMIN: 'bg-red-100 text-red-700'
};

const ROLE_LABELS = {
  EMPLOYEE: 'Employee',
  MANAGER: 'Manager',
  HR: 'HR',
  ADMIN: 'Admin'
};

const RoleBadge = ({ role }) => {
  const styles = ROLE_STYLES[role] || 'bg-gray-100 text-gray-700';
  const label = ROLE_LABELS[role] || role;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${styles}`}
    >
      {label}
    </span>
  );
};

export default RoleBadge;
