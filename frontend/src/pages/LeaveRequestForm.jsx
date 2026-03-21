import { useState } from 'react';
import { createLeave } from '../services/leaveService';

const LEAVE_TYPES = [
  { value: 'ANNUAL', label: 'Annual Leave' },
  { value: 'SICK', label: 'Sick Leave' },
  { value: 'COMPASSIONATE', label: 'Compassionate Leave' }
]

const calculateDays = (start, end) => {
  if (!start || !end) return 0;
  const startDate = new Date(start);
  const endDate = new Date(end);
  if (endDate < startDate) return 0;
  const diff = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
  return diff;
}

const LeaveRequestForm = () => {
  const [form, setForm] = useState({
    type: 'ANNUAL',
    startDate: '',
    endDate: '',
    reason: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const days = calculateDays(form.startDate, form.endDate);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setSuccess(false);
    setError('');
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.startDate || !form.endDate) {
      return setError('Please select a start and end date.');
    }
    if (days <= 0) {
      return setError('End date must be after start date.')
    }

    setLoading(true);
    try {
      await createLeave({ ...form, days });
      setSuccess(true);
      setForm({ type: 'ANNUAL', startDate: '', endDate: '', reason: '' });
    } catch (err) {
      setError('Failed to submit leave request. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl">
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-800 text-lg mb-1">Request Leave</h3>
        <p className="text-sm text-gray-400 mb-6">Fill in the details below to submit a leave request.</p>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Leave type */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Leave Type</label>
            <select name="type" value={form.type} onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
              {LEAVE_TYPES.map(({ value, label }) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>

          {/* Date range */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Start Date</label>
              <input type="data" name="startDate" value={form.startDate} onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">End Date</label>
              <input type="data" name="endDate" value={form.endDate} onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>

          {/* Live day count */}
          {days > 0 && (
            <div className="bg-blue-50 border border-blue-100 rounded-lg px-4 py-3">
              <p className="text-sm text-blue-700 font-medium">
                Duration: <span className="font-bold">{days} {days === 1 ? 'day' : 'days'}</span>
              </p>
            </div>
          )}

          {/* Reason */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Reason <span className="text-gray-300">(optional)</span>
            </label>
            <textarea name="reason" value={form.reason} onChange={handleChange} rows={3} placeholder="Briefly describe the reason for your leave..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 placeholder-gray-300 focus:outline-none ring-2 focus:ring-blue-500 resize-none" />
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-100 rounded-lg px-4 py-3">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="bg-green-50 border border-green-100 rounded-lg px-4 py-3">
              <p className="text-sm text-green-600 font-medium">✓ Leave request submitted successfully.</p>
            </div>
          )}

          {/* Submit */}
          <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold text-sm py-2.5 rounded-lg transition-colors">
            {loading ? 'Submitting...' : 'Submit Request'}
          </button>

        </form>
      </div>
    </div>
  );
}

export default LeaveRequestForm;