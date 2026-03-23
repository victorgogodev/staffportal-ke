import { useState, useEffect } from 'react';
import { uploadPayslip } from '../services/payslipService';
import api from '../services/api';

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
]

const PayslipUpload = () => {
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState({
    userId: '',
    month: '',
    year: new Date().getFullYear()
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await api.get('/users/all');
        setEmployees(res.data);
      } catch (err) {
        setError('Failed to load employees.');
      }
    }
    fetchEmployees();
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setSuccess(false);
    setError('');
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.userId || !form.month || !form.year) {
      return setError('Please select an employee, month and year.');
    }
    if (!file) {
      return setError('Please select a PDF file to upload.');
    }

    const formData = new FormData();
    formData.append('payslip', file);
    formData.append('userId', form.userId);
    formData.append('month', form.month);
    formData.append('year', form.year);

    setLoading(true);
    try {
      await uploadPayslip(formData);
      setSuccess(true);
      setForm({
        userId: '',
        month: '',
        year: new Date().getFullYear()
      });
      setFile(null);
      e.target.reset();
    } catch (err) {
      setError('Upload failed. Make sure the file is a PDF under 5MB.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl">
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-800 text-lg mb-1">Upload Payslip</h3>
        <p className="text-sm text-gray-400 mb-6">Upload a PDF payslip for a specific employee.</p>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Employee */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Employee</label>
            <select name="userId" value={form.userId} onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Select an employee...</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.firstName} {emp.lastName} - {emp.department || emp.role}
                </option>
              ))}
            </select>
          </div>

          {/* Month + Year */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Month</label>
              <select name="month" value={form.month} onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-blue-500">
                <option value="">Select month...</option>
                {MONTHS.map((m, i) => (
                  <option key={i} value={i + 1}>{m}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Year</label>
              <input type="number" name="year" value={form.year} onChange={handleChange}
                min="2020" max="2030"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>

          {/* File upload */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">PDF File</label>
            <input type="file" accept=".pdf" onChange={(e) => setFile(e.target.files[0])}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <p className="text-xs text-gray-400 mt-1">PDF only, max 5MB</p>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-100 rounded-lg px-4 py-3">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Success */}
          {error && (
            <div className="bg-green-50 border border-green-100 rounded-lg px-4 py-3">
              <p className="text-sm text-green-600">✓ Payslip uploaded successfully.</p>
            </div>
          )}

          {/* Submit */}
          <button type="submit" disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold text-sm py-2.5 rounded-lg transition-colors">
            {loading ? 'Uploading...' : 'Upload Payslip'}
          </button>

        </form>
      </div>
    </div>
  );
}

export default PayslipUpload;