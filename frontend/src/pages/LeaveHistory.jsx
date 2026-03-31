import { useState, useEffect } from 'react';
import { getMyLeaves } from '../services/leaveService';
import { formatShortDate } from '../utils/formatDate';

const STATUS_STYLES = {
  PENDING: 'bg-amber-100 text-amber-700',
  APPROVED: 'bg-green-100 text-green-700',
  REJECTED: 'bg-red-100 text-red-700'
};

const TYPE_LABELS = {
  ANNUAL: 'Annual Leave',
  SICK: 'Sick Leave',
  COMPASSIONATE: 'Compassionate Leave'
};

const LeaveHistory = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        const data = await getMyLeaves();
        setLeaves(data);
      } catch (err) {
        setError('Failed to load leave history.');
      } finally {
        setLoading(false);
      }
    };
    fetchLeaves();
  }, []);

  if (loading)
    return (
      <div className='text-sm text-gray-400 py-10 text-center'>
        Loading leave history...
      </div>
    );

  if (error)
    return (
      <div className='text-sm text-red-500 py-10 text-center'>{error}</div>
    );

  return (
    <div className='space-y-4'>
      <div className='bg-white rounded-xl border border-gray-200 p-5'>
        <div className='flex items-center justify-between mb-4'>
          <h3 className='font-semibold text-gray-800'>My Leave History</h3>
          <span className='text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full'>
            {leaves.length} {leaves.length === 1 ? 'request' : 'requests'}
          </span>
        </div>

        {leaves.length === 0 ? (
          <p className='text-sm text-gray-400 text-center py-8'>
            No leave requests yet. Submit your first request from the My Leave
            page.
          </p>
        ) : (
          <div className='overflow-x-auto'>
            <table className='w-full text-sm'>
              <thead>
                <tr className='border-b border-gray-100'>
                  <th className='text-left py-2 px-3 text-gray-500 font-medium'>
                    Type
                  </th>
                  <th className='text-left py-2 px-3 text-gray-500 font-medium'>
                    Start
                  </th>
                  <th className='text-left py-2 px-3 text-gray-500 font-medium'>
                    End
                  </th>
                  <th className='text-left py-2 px-3 text-gray-500 font-medium'>
                    Days
                  </th>
                  <th className='text-left py-2 px-3 text-gray-500 font-medium'>
                    Status
                  </th>
                  <th className='text-left py-2 px-3 text-gray-500 font-medium'>
                    Note
                  </th>
                </tr>
              </thead>
              <tbody>
                {leaves.map((leave) => (
                  <tr
                    key={leave.id}
                    className='border-b border-gray-50 hover:bg-gray-50 transition-colors whitespace-nowrap'
                  >
                    <td classname='py-3 px-3 font-medium text-gray-800 whitespace-nowrap'>
                      {TYPE_LABELS[leave.type]}
                    </td>
                    <td className='py-3 px-3 text-gray-600 whitespace-nowrap'>
                      {formatShortDate(leave.startDate)}
                    </td>
                    <td className='py-3 px-3 text-gray-600 whitespace-nowrap'>
                      {formatShortDate(leave.endDate)}
                    </td>
                    <td className='py-3 px-3 text-gray-600 whitespace-nowrap'>
                      {leave.days}
                    </td>
                    <td className='py-3 px-3 whitespace-nowrap'>
                      <span
                        className={`text-xs font semibold px-2 py-0.5 rounded-full ${STATUS_STYLES[leave.status]}`}
                      >
                        {leave.status}
                      </span>
                    </td>
                    <td className='py-3 px-3 text-gray-400 text-xs whitespace-nowrap'>
                      {leave.reviewNote || '—'}
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

export default LeaveHistory;
