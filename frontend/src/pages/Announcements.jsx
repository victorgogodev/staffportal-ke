import { useState, useEffect } from 'react';
import {
  getAnnouncements,
  createAnnouncement,
  deleteAnnouncement
} from '../services/announcementService';
import useAuthStore from '../store/authStore';
import { formatFullDate } from '../utils/formatDate';

const Announcements = () => {
  const user = useAuthStore((state) => state.user);
  const canManage = ['HR', 'ADMIN'].includes(user?.role);

  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', body: '' });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const data = await getAnnouncements();
      setAnnouncements(data);
    } catch (err) {
      setError('Failed to load announcements.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!form.title.trim() || !form.body.trim()) {
      return setFormError('Title and body are required.');
    }
    setSubmitting(true);
    try {
      const created = await createAnnouncement(form);
      setAnnouncements((prev) => [created, ...prev]);
      setForm({ title: '', body: '' });
      setShowForm(false);
    } catch (err) {
      setFormError('Failed to create announcement.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this announcement?')) return;
    try {
      await deleteAnnouncement(id);
      setAnnouncements((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      setError('Failed to delete announcement.');
    }
  };

  if (loading)
    return (
      <div className='text-sm text-gray-400 py-10 text-center'>
        Loading announcements...
      </div>
    );

  return (
    <div className='space-y-4'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-lg font-semibold text-gray-800'>Announcements</h2>
          <p className='text-sm text-gray-400'>
            {announcements.length} announcement
            {announcements.length !== 1 ? 's' : ''}
          </p>
        </div>
        {canManage && (
          <button
            onClick={() => setShowForm((v) => !v)}
            className='bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors'
          >
            {showForm ? 'Cancel' : '+ New Announcement'}
          </button>
        )}
      </div>

      {/* Create form - HR/Admin only */}
      {showForm && canManage && (
        <div className='bg-white rounded-xl border border-gray-200 p-6'>
          <h3 className='font-semibold text-gray-800 mb-4'>New Announcement</h3>
          <form onSubmit={handleCreate} className='space-y-4'>
            <div>
              <label className='block text-xs font-medium text-gray-500 mb-1'>
                Title
              </label>
              <input
                value={form.title}
                onChange={(e) =>
                  setForm((p) => ({ ...p, title: e.target.value }))
                }
                placeholder='Announcement title...'
                className='w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
              />
            </div>
            <div>
              <label className='block text-xs font-medium text-gray-500 mb-1'>
                Body
              </label>
              <textarea
                value={form.body}
                onChange={(e) =>
                  setForm((p) => ({ ...p, body: e.target.value }))
                }
                rows={4}
                placeholder='Write the announcement...'
                className='w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none'
              />
            </div>
            {formError && <p className='text-sm text-red-500'>{formError}</p>}
            <button
              type='submit'
              disabled={submitting}
              className='bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold text-sm px-5 py-2 rounded-lg transition-colors'
            >
              {submitting ? 'Posting...' : 'Post Announcement'}
            </button>
          </form>
        </div>
      )}

      {error && <p className='text-sm text-red-500'>{error}</p>}

      {/* Announcements list */}
      {announcements.length === 0 ? (
        <div className='bg-white rounded-xl border border-gray-200 p-10 text-center'>
          <p className='text-sm text-gray-400'>No announcements yet.</p>
        </div>
      ) : (
        <div className='space-y-3'>
          {announcements.map((a) => (
            <div
              key={a.id}
              className='bg-white rounded-xl border border-gray-200 p-5'
            >
              <div className='flex items-start justify-between gap-4'>
                <div className='flex-1'>
                  <h3 className='font-semibold text-gray-800 mb-1'>
                    {a.title}
                  </h3>
                  <p className='text-sm text-gray-600 leading-relaxed mb-3'>
                    {a.body}
                  </p>
                  <p className='text-xs text-gray-400'>
                    Posted by {a.author?.firstName} {a.author?.lastName} ·{' '}
                    {formatFullDate(a.createdAt)}
                  </p>
                </div>
                {canManage && (
                  <button
                    onClick={() => handleDelete(a.id)}
                    className='text-red-400 hover:text-red-600 text-xs font-medium px-2 py-1 rounded hover:bg-red-50 transition-colors shrink-0'
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Announcements;
