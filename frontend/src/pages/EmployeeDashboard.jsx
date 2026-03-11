import StatCard from '../components/StatCard';

const EmployeeDashboard = () => {
  return (
    <div className="space-y-6">

      {/* Stat cards */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard icon="📅" number="18" label="Leave Days Left" bg="bg-blue-50" textColor="text-blue-700" />
        <StatCard icon="✅" number="3" label="Approved" bg="bg-green-50" textColor="text-green-700" />
        <StatCard icon="⏳" number="1" label="Pending" bg="bg-amber-50" textColor="text-amber-700" />
        <StatCard icon="📄" number="6" label="Payslips" bg="bg-gray-50" textColor="text-gray-700" />
      </div>

      {/* Two column layout */}
      <div className="grid grid-cols-3 gap-4">

        {/* Leave balance */}
        <div className="col-span-2 bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="font-semibold text-gray-800 mb-4">Leave Balance</h3>
          <div className="space-y-3">
            {[
              { type: 'Annual Leave', used: 3, total: 21, color: 'bg-blue-500' },
              { type: 'Sick Leave', used: 0, total: 10, color: 'bg-green-500' },
              { type: 'Compassionate', used: 0, total: 3, color: 'bg-purple-500' }
            ].map(({ type, used, total, color }) => (
              <div key={type}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700 font-medium">{type}</span>
                  <span className="text-gray-500">{total - used} / {total} days left</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className={`${color} h-2 rounded-full`}
                    style={{ width: `${(used / total) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Announcements */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="font-semibold text-gray-800 mb-4">Announcements</h3>
          <div className="space-y-3">
            {[
              { date: 'Mar 1', text: 'Public Holiday - Madaraka Day reminder' },
              { date: 'Feb 28', text: 'Q1 Performance reviews begin next week' },
              { date: 'Feb 20', text: 'Update leave policy - check HR portal' }
            ].map(({ date, text }) => (
              <div key={date} className="border-l-2 border-blue-300 pl-3">
                <p className="text-xs text-gray-400">{date}</p>
                <p className="text-sm text-gray-700">{text}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

export default EmployeeDashboard;