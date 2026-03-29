import { useState, useEffect } from 'react';
import { getAuditLogs } from '../services/auditService';

const ACTION_STYLES = {
  ANNOUNCEMENT_CREATE: 'bg-blue-100 text-blue-700',
  ANNOUNCEMENT_DELETE: 'bg-red-100 text-red-700',
  LOGIN: 'bg-green-100 text-green-700',
  LOGIN_FAIL: 'bg-red-100 text-red-700',
  LEAVE_APPROVE: 'bg-green-100 text-green-700',
  LEAVE_REJECT: 'bg-amber-100 text-amber-700',
  PAYSLIP_UPLOAD: 'bg-purple-100 text-purple-700'
};

const AuditLog = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ total: 0, pages: 1 });

  useEffect(() => {
    fetchLogs(page);
  }, [page]);

  const fetchLogs = async (p) => {
    setLoading(true);
    try {
      const data = await getAuditLogs(p);
      setLogs(data.logs);
      setMeta({ total: data.total, pages: data.pages });
    } catch (err) {
      setError('Failed to load audit logs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='space-y-4'>
      <div className='bg-white rounded-xl border border-gray-200 p-5'>
        <div className='flex items-center justify-between mb-4'>
          <h3 className='font-semibold text-gray-800'>Audit Log</h3>
          <span className='text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full'>
            {meta.total} total events
          </span>
        </div>

        {error && <p className='text-sm text-red-500 mb-4'>{error}</p>}

        {loading ? (
          <p className='text-sm text-gray-400 text-center py-8'>Loading...</p>
        ) : logs.length === 0 ? (
          <p className='text-sm text-gray-400 text-center py-8'>
            No audit events yet.
          </p>
        ) : (
          <div className='overflow-x-auto'>
            <table className='w-full text-sm'>
              <thead>
                <tr className='border-b border-gray-100'>
                  <th className='text-left py-2 text-gray-500 font-medium'>
                    Time
                  </th>
                  <th className='text-left py-2 text-gray-500 font-medium'>
                    User
                  </th>
                  <th className='text-left py-2 text-gray-500 font-medium'>
                    Action
                  </th>
                  <th className='text-left py-2 text-gray-500 font-medium'>
                    Detail
                  </th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr
                    key={log.id}
                    className='border-b border-gray-50 hover:bg-gray-50 transition-colors'
                  >
                    <td className='py-3 px-3 text-gray-400 text-xs font-mono'>
                      {new Date(log.createdAt).toLocaleString('en-KE', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td className='py-3 px-3'>
                      {log.user ? (
                        <span className='font-medium text-gray-800'>
                          {log.user.firstName} {log.user.lastName}
                        </span>
                      ) : (
                        <span className='text-gray-400'>—</span>
                      )}
                    </td>
                    <td className='py-3 px-3'>
                      <span
                        className={`text-xs font-semibold px-2 py-0.5 rounded-full font-mono ${ACTION_STYLES[log.action] || 'bg-gray-100 text-gray-700'}`}
                      >
                        {log.action}
                      </span>
                    </td>
                    <td className='py-3 px-3 text-gray-500 text-xs'>
                      {log.detail || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {meta.pages > 1 && (
          <div className='flex items-center justify-between mt-4 pt-4 border-t border-gray-100'>
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className='text-sm text-gray-500 hover:text-gray-700 disabled:opacity-40 px-3 py-1.5 rounded border border-gray-200 hover:bg-gray-50 transition-colors'
            >
              Previous
            </button>
            <span className='text-xs text-gray-400'>
              Page {page} of {meta.pages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(meta.pages, p + 1))}
              disabled={page === meta.pages}
              className='text-sm text-gray-500 hover:text-gray-700 disabled:opacity-40 px-3 py-1.5 rounded border border-gray-200 hover:bg-gray-50 transition-colors'
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuditLog;
