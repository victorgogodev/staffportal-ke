import StatCard from '../components/StatCard';

const AdminDashboard = () => {
  return (
    <div className="space-y-6">

      {/* Stat cards */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard icon="👥" number="47" label="Total Users" bg="bg-blue-50" textColor="text-blue-700" />
        <StatCard icon="🔍" number="14" label="Audit Today" bg="bg-gray-50" textColor="text-gray-700" />
        <StatCard icon="⚠️" number="2" label="Failed Logins" bg="bg-red-50" textColor="text-red-700" />
        <StatCard icon="✅" number="99%" label="System Health" bg="bg-green-50" textColor="text-green-700" />
      </div>

      {/* Audit log */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-800">Recent Audit Activity</h3>
          <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">142 events today</span>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left py-2 px-3 text-gray-500 font-medium">Time</th>
              <th className="text-left py-2 px-3 text-gray-500 font-medium">User</th>
              <th className="text-left py-2 px-3 text-gray-500 font-medium">Action</th>
              <th className="text-left py-2 px-3 text-gray-500 font-medium">Detail</th>
            </tr>
          </thead>
          <tbody>
            {[
              { time: '09:14', user: 'Alice Kamau', action: 'LOGIN', detail: 'Success', fail: false },
              { time: '09:22', user: 'Brian Otieno', action: 'LEAVE_APPROVE', detail: 'Leave #34 - Alice', fail: false },
              { time: '09:45', user: 'Carol Wanjiku', action: 'PAYSLIP_UPLOAD', detail: 'Alice - Feb 2026', fail: false },
              { time: '10:01', user: 'Unknown', action: 'LOGIN_FAIL', detail: 'Wrong password', fail: true },
              { time: '10:15', user: 'David Mwangi', action: 'LOGIN', detail: 'Success', fail: false },
              { time: '11:02', user: 'Brian Otieno', action: 'LEAVE_REJECT', detail: 'Leave #35 - Purity', fail: false }
            ].map(({ time, user, action, detail, fail }) => (
              <tr key={`${time}-${user}`}
                className={`border-b border-gray-50 transition-colors ${fail ? 'bg-red-50 hover:bg-red-100' : 'hover: bg-gray-50'}`}>
                <td className="py-3 px-3 text-gray-500 font-mono">{time}</td>
                <td className="py-3 px-3 font-medium text-gray-800">{user}</td>
                <td className="py-3 px-3">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full font-mono ${fail ? 'bg-red-100 text-red-700' :
                    action === 'LOGIN' ? 'bg-blue-100 text-blue-700' :
                      action === 'LEAVE_APPROVE' ? 'bg-green-100 text-green-700' :
                        action === 'LEAVE_REJECT' ? 'bg-amber-100 text-amber-700' :
                          action === 'PAYSLIPS_UPLOAD' ? 'bg-purple-100 text-purple-700' :
                            'bg-gray-100 text-gray-700'
                    }`}>{action}</span>
                </td>
                <td className="py-3 px-3 text-gray-600">{detail}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}

export default AdminDashboard;