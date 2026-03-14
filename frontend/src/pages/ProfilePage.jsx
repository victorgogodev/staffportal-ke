import { useEffect, useState } from 'react';
import useAuthStore from '../store/authStore';

const ProfilePage = () => {
  const user = useAuthStore((state) => state.user);

  const [form, setForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    dateOfBirth: user?.dateOfBirth || '',
    address: user?.address || ''
  });

  const [passwords, setPasswords] = useState({
    current: '',
    next: '',
    confirm: ''
  });

  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        dateOfBirth: user.dateOfBirth || '',
        address: user.address || '',
      });
    }
  }), [user];

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setSaved(false);
  }

  const handlePasswordChange = (e) => {
    setPasswords((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    // TODO Phase 3 backend: await api.patch('/users/me', form);
    await new Promise((r) => setTimeout(r, 600)); // simulate network
    setLoading(false);
    setSaved(true);
  }

  const initials = `${user?.firstName?.[0] || ''}${user?.lastName?.[0] || ''}`

  const roleStyles = {
    EMPLOYEE: 'bg-blue-100 text-blue-700',
    MANAGER: 'bg-purple-100 text-purple-700',
    HR: 'bg-green-100 text-green-700',
    ADMIN: 'bg-red-100 text-red-700'
  }

  return (
    <div className="flex gap-5">

      {/* ── Left panel ───────────────────────────────── */}
      <div className="w-52 shrink-0">
        <div className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col items-center text-center">

          {/* Avatar */}
          <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl font-bold mb-3">
            {initials}
          </div>

          <p className="font-semibold text-gray-800 text-sm">{user?.firstName} {user?.lastName}</p>
          <p className="text-gray-400 text-xs mb-3 truncate w-full">{user?.email}</p>

          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full mb-4 ${roleStyles[user?.role]}`}>
            {user?.role}
          </span>

          <div className="w-full border-t border-gray-100 pt-4 text-left space-y-3">
            <div>
              <p className="text-xs text-gray-400 font-medium">Department</p>
              <p className="text-sm text-gray-700">{user?.department || '—'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium">Member since</p>
              <p className="text-sm text-gray-700">{user?.joinedAt || 'January 2024'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium">Employee ID</p>
              <p className="text-sm text-gray-700">{user?.employeeId || 'EMP-0042'}</p>
            </div>
          </div>

        </div>
      </div>

      {/* ── Right panel — form ───────────────────────── */}
      <div className="flex-1">
        <form onSubmit={handleSave} className="space-y-6">

          {/* Personal information */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-800 mb-4 pb-3 border-b border-gray-100">
              Personal Information
            </h3>
            <div className="space-y-4">

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">First Name</label>
                  <input name="firstName" value={form.firstName} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Last Name</label>
                  <input name="lastName" value={form.lastName} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Email Address</label>
                <input name="email" value={form.email} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Phone Number</label>
                  <input name="phone" value={form.phone} onChange={handleChange}
                    placeholder="+254 7XX XXX XXX"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Date of Birth</label>
                  <input name="dateOfBirth" value={form.dateOfBirth} onChange={handleChange}
                    placeholder="DD / MM / YYYY"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Home Address</label>
                <input name="address" value={form.address} onChange={handleChange}
                  placeholder="e.g. Westlands, Nairobi"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>

            </div>
          </div>

          {/* Work information — read only */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-800 mb-4 pb-3 border-b border-gray-100">
              Work Information
              <span className="ml-2 text-xs font-normal text-gray-400">(read-only)</span>
            </h3>
            <div className="space-y-4">

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Department</label>
                  <input value={user?.department || '—'} readOnly className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-400 bg-gray-50 cursor-not-allowed" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Job Title</label>
                  <input value={user?.jobTitle || '—'} readOnly className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-400 bg-gray-50 cursor-not-allowed" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Employee ID</label>
                  <input value={user?.employeeId || 'EMP-0042'} readOnly className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-400 bg-gray-50 cursor-not-allowed" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Date Joined</label>
                  <input value={user?.joinedAt || 'January 2024'} readOnly className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-400 bg-gray-50 cursor-not-allowed" />
                </div>
              </div>

            </div>
          </div>

          {/* Change password */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-800 mb-4 pb-3 border-b border-gray-100">
              Change password
            </h3>
            <div className="space-y-4">

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Current Password</label>
                <input name="current" type="password" value={passwords.current}
                  onChange={handlePasswordChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">New Password</label>
                  <input name="next" type="password" value={passwords.next}
                    onChange={handlePasswordChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Confirm Password</label>
                  <input name="confirm" type="password" value={passwords.confirm}
                    onChange={handlePasswordChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>

            </div>
          </div>

          {/* Save */}
          <div className="flex items-center gap-4">
            <button type="submit" disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold text-sm px-6 py-2.5 rounded-lg transition-colors">
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
            {saved && (
              <span className="text-sm text-green-600 font-medium">✓ Changes saved</span>
            )}
          </div>

        </form>
      </div>

    </div>
  );
}

export default ProfilePage;