import StatCard from '../components/StatCard';

const ManagerDashboard = () => {
  return (
    <div className="space-y-6">

      {/* Stat cards */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard icon="👥" number="8" label="My Team" bg="bg-purple-50" textColor="text-purple-700" />
        <StatCard icon="⏳" number="3" label="Pending" bg="bg-red-50" textColor="text-red-700" />
        <StatCard icon="✅" number="12" label="Approved" bg="bg-green-50" textColor="text-green-700" />
        <StatCard icon="📆" number="14" label="Leave Remaining" bg="bg-blue-50" textColor="text-blue-700" />
      </div>

      {/* Team table */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="font-semibold text-gray-800 mb-4">My Team</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left py-2 px-3 text-gray-500 font-medium">Name</th>
              <th className="text-left py-2 px-3 text-gray-500 font-medium">Role</th>
              <th className="text-left py-2 px-3 text-gray-500 font-medium">Department</th>
              <th className="text-left py-2 px-3 text-gray-500 font-medium">Status</th>
              <th className="text-left py-2 px-3 text-gray-500 font-medium">Pending</th>
            </tr>
          </thead>
          <tbody>
            {[
              { name: 'Alice Kamau', role: 'Engineer', dept: 'Engineering', status: 'Active', pending: 0 },
              { name: 'James Mwenda', role: 'Engineer', dept: 'Engineering', status: 'Active', pending: 1 },
              { name: 'Purity Njeri', role: 'Designer', dept: 'Design', status: 'On Leave', pending: 0 },
              { name: 'Kevin Odhiambo', role: 'QA', dept: 'Engineering', status: 'Active', pending: 0 }
            ].map(({ name, role, dept, status, pending }) => (
              <tr key={name} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="py-3 px-3 font-medium text-gray-800">{name}</td>
                <td className="py-3 px-3 text-gray-600">{role}</td>
                <td className="py-3 px-3 text-gray-600">{dept}</td>
                <td className="py-3 px-3">
                  <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full
                     ${status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                    {status === 'Active' ? '●' : '○'} {status}
                  </span>
                </td>
                <td className="py-3 px-3">
                  {pending > 0
                    ? <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-0.5 rounded-full">{pending} pending</span>
                    : <span className="text-gray-400 text-xs">-</span>
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  )
}

export default ManagerDashboard;