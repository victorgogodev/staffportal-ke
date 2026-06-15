import { useState, useEffect } from 'react';
import api from '../services/api';

const ROLE_STYLES = {
  EMPLOYEE: 'bg-blue-100 text-blue-700',
  MANAGER: 'bg-purple-100 text-purple-700',
  HR: 'bg-green-100 text-green-700',
  ADMIN: 'bg-red-100 text-red-700'
};

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await api.get('/users/all');
        setEmployees(res.data);
      } catch (err) {
        setError('Failed to load employees.');
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  const filtered = employees.filter((e) =>
    `${e.firstName} ${e.lastName} ${e.email} ${e.department || ''} ${e.role}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  if (loading)
    return (
      <div className='text-sm text-gray-400 py-10 text-center'>
        Loading employees...
      </div>
    );

  if (error)
    return (
      <div className='text-sm text-red-500 py-10 text-center'>{error}</div>
    );

  return (
    <div className='space-y-4'>
      {/* Header */}
      <div className='flex items-center justify-between grid grid-cols-1 lg:grid-cols-3 gap-4'>
        <div className='flex items-center justify-between mb-4'>
          <h2 className='text-lg font-semibold text-gray-800'>Employees</h2>
          <p className='text-sm text-gray-400 bg-gray-100 px-2 py-1 rounded-full'>
            {employees.length} employees
          </p>
        </div>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder='Search by name, email, department...'
          className='border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 w-72 focus:outline-none focus:ring-2 focus:ring-blue-500'
        />
      </div>

      {/* Table */}
      <div className='bg-white rounded-xl border border-gray-200 p-5'>
        {filtered.length === 0 ? (
          <p className='text-sm text-gray-400 text-center py-8'>
            No employees match your search.
          </p>
        ) : (
          <div className='overflow-x-auto'>
            <table className='w-full text-sm'>
              <thead>
                <tr className='border-b border-gray-100'>
                  <th className='text-left py-2 px-3 text-gray-500 font-medium'>
                    Name
                  </th>
                  <th className='text-left py-2 px-3 text-gray-500 font-medium'>
                    Email
                  </th>
                  <th className='text-left py-2 px-3 text-gray-500 font-medium'>
                    Department
                  </th>
                  <th className='text-left py-2 px-3 text-gray-500 font-medium'>
                    Role
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((emp) => (
                  <tr
                    key={emp.id}
                    className='border-b border-gray-50 hover:bg-gray-50 transition-colors'
                  >
                    <td className='py-3 px-3'>
                      <div className='flex items-center gap-3'>
                        <div className='w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold shrink-0'>
                          {emp.firstName?.[0]?.toUpperCase()}
                          {emp.lastName?.[0]?.toUpperCase()}
                        </div>
                        <span className='font-medium text-gray-800 whitespace-nowrap'>
                          {emp.firstName} {emp.lastName}
                        </span>
                      </div>
                    </td>
                    <td className='py-3 px-3 text-gray-500 whitespace-nowrap'>
                      {emp.email}
                    </td>
                    <td className='py-3 px-3 text-gray-600 whitespace-nowrap'>
                      {emp.department || '—'}
                    </td>
                    <td className='py-3 px-3'>
                      <span
                        className={`text-xs font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${ROLE_STYLES[emp.role]}`}
                      >
                        {emp.role}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Employees;
