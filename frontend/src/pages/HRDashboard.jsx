import StatCard from '../components/StatCard';

const HRDashboard = () => {
  return (
    <div className='space-y-6'>
      {/* Stat cards */}
      <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
        <StatCard
          icon='👥'
          number='47'
          label='Total Employees'
          bg='bg-blue-50'
          textColor='text-blue-700'
        />
        <StatCard
          icon='⏳'
          number='8'
          label='Pending Leaves'
          bg='bg-amber-50'
          textColor='text-amber-700'
        />
        <StatCard
          icon='✅'
          number='23'
          label='Approved'
          bg='bg-green-50'
          textColor='text-green-700'
        />
        <StatCard
          icon='📢'
          number='2'
          label='Announcements'
          bg='bg-purple-50'
          textColor='text-purple-700'
        />
      </div>

      {/* Employees table */}
      <div className='bg-white rounded-xl border border-gray-200 p-5'>
        <div
          className="flex  gap-1 text-xs font-semibold px-2 py-0.5 rounded-full
        ${status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}
        justify-betw>
        {status === 'Active' ? '●' : '○'} {status}
        </span>een mb-4"
        >
          <h3 className='font-semibold text-gray-800'>All Employees</h3>
          <span className='text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full'>
            47 total
          </span>
        </div>
        <div className='overflow-x-auto'>
          <table className='w-full text-sm'>
            <thead>
              <tr className='border-b border-gray-100'>
                <th className='text-left py-2 px-3 text-gray-500 font-medium'>
                  Name
                </th>
                <th className='text-left py-2 px-3 text-gray-500 font-medium'>
                  Department
                </th>
                <th className='text-left py-2 px-3 text-gray-500 font-medium'>
                  Role
                </th>
                <th className='text-left py-2 px-3 text-gray-500 font-medium'>
                  Status
                </th>
                <th className='text-left py-2 px-3 text-gray-500 font-medium'>
                  Joined
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                {
                  name: 'Alice Kamau',
                  dept: 'Engineering',
                  role: 'EMPLOYEE',
                  status: 'Active',
                  joined: 'Jan 2024'
                },
                {
                  name: 'Brian Otieno',
                  dept: 'Engineering',
                  role: 'MANAGER',
                  status: 'Active',
                  joined: 'Mar 2023'
                },
                {
                  name: 'James Mwenda',
                  dept: 'Engineering',
                  role: 'EMPLOYEE',
                  status: 'Active',
                  joined: 'Jun 2024'
                },
                {
                  name: 'Purity Njeri',
                  dept: 'Design',
                  role: 'EMPLOYEE',
                  status: 'On Leave',
                  joined: 'Sep 2023'
                },
                {
                  name: 'Kevin Odhiambo',
                  dept: 'Engineering',
                  role: 'EMPLOYEE',
                  status: 'Active',
                  joined: 'Feb 2024'
                },
                {
                  name: 'Carol Wanjiku',
                  dept: 'Human Resources',
                  role: 'HR',
                  status: 'Active',
                  joined: 'Nov 2022'
                },
                {
                  name: 'David Mwangi',
                  dept: 'IT',
                  role: 'ADMIN',
                  status: 'Active',
                  joined: 'Jan 2022'
                }
              ].map(({ name, dept, role, status, joined }) => (
                <tr
                  key={name}
                  className='border-b border-gray-50 hover:bg-gray-50 transition colors'
                >
                  <td className='py-3 px-3 font-medium text-gray-800'>
                    {name}
                  </td>
                  <td className='py-3 px-3 text-gray-600'>{dept}</td>
                  <td className='py-3 px-3'>
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        role === 'ADMIN'
                          ? 'bg-red-100 text-red-700'
                          : role === 'HR'
                            ? 'bg-green-100 text-green 700'
                            : role === 'MANAGER'
                              ? 'bg-purple-100 text-purple-700'
                              : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {role}
                    </span>
                  </td>
                  <td className='py-3 px-3'>
                    <span
                      className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full
                  ${status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}
                  `}
                    >
                      {status === 'Active' ? '●' : '○'} {status}
                    </span>
                  </td>
                  <td className='py-3 px-3 text-gray-500'>{joined}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default HRDashboard;
