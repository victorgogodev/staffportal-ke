import { useState, useEffect } from 'react';
import { getAllLeaves, approveLeave, rejectLeave } from '../services/leaveService';
import { formatShortDate } from '../utils/formatDate';

const STATUS_STYLES = {
  PENDING: 'bg-amber-100 text-amber-700',
  APPROVED: 'bg-green-100 text-green-700',
  REJECTED: 'bg-red-100 text-red-700',
}

const TYPE_LABELS = {
  ANNUAL: 'Annual Leave',
  SICK: 'Sick Leave',
  COMPASSIONATE: 'Compassionate Leave'
}

const LeaveApprovals = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [rejectModal, setRejectModal] = useState(null) // holds leave id being rejected
  const [reviewNote, setReviewNote] = useState('');
  const [actionError, setActionError] = useState('');

  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        const data = await getAllLeaves();
        setLeaves(data);
      } catch (err) {
        setError('Failed to load requests.');
      } finally {
        setLoading(false);
      }
    }
    fetchLeaves();
  }, []);

  const handleApprove = async (id) => {
    try {
      const updated = await approveLeave(id);
      setLeaves((prev) => prev.map((l) => l.id === id ? { ...l, ...updated } : l));
    } catch (err) {
      setActionError('Failed to approve leave.')
    }
  }

  const handleReject = async () => {
    if (!reviewNote.trim()) {
      return setActionError('A reason is required when rejecting a leave.');
    }
    try {
      const updated = await rejectLeave(rejectModal, reviewNote);
      setLeaves((prev) => prev.map((l) => l.id === rejectModal ? { ...l, ...updated } : l));
      setRejectModal(null);
      setReviewNote('');
      setActionError('');
    } catch (err) {
      setActionError('Failed to reject leave.')
    }
  }

  const pending = leaves.filter((l) => l.status === 'PENDING');
  const reviewed = leaves.filter((l) => l.status !== 'PENDING');

  if (loading) return (
    <div className="text-sm text-gray-400 py-10 text-center">Loading leave requests...</div>
  );

  if (error) return (
    <div className="text-sm text-red-500 py-10 text-center">{error}</div>
  );

  const LeaveTable = ({ rows, showActions }) => (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-gray-100">
          <th className="text-left py-2 px-3 text-gray-500 font-medium">Employee</th>
          <th className="text-left py-2 px-3 text-gray-500 font-medium">Type</th>
          <th className="text-left py-2 px-3 text-gray-500 font-medium">Dates</th>
          <th className="text-left py-2 px-3 text-gray-500 font-medium">Days</th>
          <th className="text-left py-2 px-3 text-gray-500 font-medium">Status</th>
          {showActions && <th className="text-left py-2 px-3 text-gray-500 font-medium">Action</th>}
          {!showActions && <th className="text-left py-2 px-3 text-gray-500 font-medium">Note</th>}
        </tr>
      </thead>
      <tbody>
        {rows.map((leave) => (
          <tr key={leave.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
            <td className="py-3 px-3 font-medium text-gray-800">
              {leave.user?.firstName} {leave.user?.lastName}
              <p className="text-xs text-gray-400 font-normal">{leave.user?.department}</p>
            </td>
            <td className="py-3 px-3 text-gray-600">{TYPE_LABELS[leave.type]}</td>
            <td className="py-3 px-3 text-gray-600">
              {formatShortDate(leave.startDate)} - {formatShortDate(leave.endDate)}
            </td>
            <td className="py-3 px-3 text-gray-600">{leave.days}</td>
            <td className="py-3 px-3">
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${STATUS_STYLES[leave.status]}`}>
                {leave.status}
              </span>
            </td>
            {showActions && (
              <td className="py-3 px-3">
                <div className="flex gap-2">
                  <button onClick={() => handleApprove(leave.id)}
                    className="bg-green-100 hover:bg-green-200 text-green-700 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors">
                    ✓ Approve
                  </button>
                  <button onClick={() => { setRejectModal(leave.id); setActionError('') }}
                    className="bg-red-100 hover:bg-red-200 text-red-700 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors">
                    ✗ Reject
                  </button>
                </div>
              </td>
            )}
            {!showActions && (
              <td className="py-3 px-3 text-gray-400 text-xs">{leave.reviewNote || '—'}</td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <div className="space-y-6">

      {/* Pending */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-800">Pending Requests</h3>
          {pending.length > 0 && (
            <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded-full">
              {pending.length} pending
            </span>
          )}
        </div>
        {pending.lenth === 0
          ? <p className="text-sm text-gray-400 text-center py-6">No pending requests. 🎉</p>
          : <LeaveTable rows={pending} showActions={true} />
        }
      </div>

      {/* Reviewed */}
      {reviewed.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="font-semibold text-gray-800 mb-4">Reviewed</h3>
          <LeaveTable rows={reviewed} showActions={false} />
        </div>
      )}

      {/* Reject modal */}
      {rejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl border-gray-200 p-6 w-full max-w-md mx-4">
            <h3 className="font-semibold text-gray-800 mb-1">Reject Leave Request</h3>
            <p className="text-sm text-gray-400 mb-4">Please provide a reason for rejecting this request.</p>
          </div>

          <textarea
            value={reviewNote}
            onChange={(e) => setReviewNote(e.target.value)}
            rows={3}
            placeholder="e.g. Insufficient leave balance, critical project deadline..."
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 resize-none mb-3"
          />

          {actionError && (
            <p className="text-sm text-red-500 mb-3">{actionError}</p>
          )}

          <div className="flex gap-3 justify-end">
            <button onClick={() => { setRejectModal(null); setReviewNote(''); setActionError('') }}
              className="text-sm text-gray-500 hover:text-gray-700 px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button onClick={handleReject}
              className="bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
              Confirm Reject
            </button>
          </div>
        </div>

      )}

    </div>
  )
}

export default LeaveApprovals;