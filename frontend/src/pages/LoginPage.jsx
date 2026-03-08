import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import authService from '../services/authService';
import toast, { Toaster } from 'react-hot-toast';

const ROLE_REDIRECTS = {
  EMPLOYEE: '/dashboard',
  MANAGER: '/manager',
  HR: '/hr',
  ADMIN: '/admin'
}

const LoginPage = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!email) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email = 'Enter a valid email';
    if (!password) errs.password = 'Password is required';
    else if (password.length < 6) errs.password = 'Password must be at least 6 characters';
    return errs;
  }

  const handleSubmit = async () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const data = await authService.login(email, password);
      login(data.user, data.token);
      toast.success(`Welcome back, ${data.user.firstName}!`);
      navigate(ROLE_REDIRECTS[data.user.role] || '/dashboard');
    } catch (err) {
      const msg = err.response?.data?.message || 'Something went wrong';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Toaster position="top-right" />
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-1">Welcome back</h2>
        <p className="text-gray-500 text-sm mb-6">Sign in to your account</p>

        {/* Email */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${errors.email ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
          )}
        </div>

        {/* Password */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="........"
            className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${errors.password ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
          />
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">{errors.password}</p>
          )}
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold py-2.5 rounded-lg transition text-sm"
        >
          {loading ? 'Signing in...' : 'Sign in'}
        </button>

        {/* Dev helper - remove before deploying */}
        <div className="mt-6 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-xs text-gray-400 font-medium mb-1">Dev shortcuts</p>
          {[
            { label: 'Employee', email: 'employee@staffportal.com' },
            { label: 'Manager', email: 'manager@staffportal.com' },
            { label: 'HR', email: 'hr@staffportal.com' },
            { label: 'Admin', email: 'admin@staffportal.com' }
          ].map(({ label, email: e }) => (
            <button
              key={label}
              onClick={() => { setEmail(e); setPassword('password123') }}
              className="text-xs text-blue-500 hover:underline mr-3"
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

export default LoginPage;