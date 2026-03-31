import { useState, useEffect } from 'react';
import { getMyPayslips, downloadPayslip } from '../services/payslipService';

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
];

const MyPayslips = () => {
  const [payslips, setPayslips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [downloading, setDownloading] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getMyPayslips();
        setPayslips(data);
      } catch (err) {
        setError('Failed to load payslips.');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const handleDownload = async (payslip) => {
    setDownloading(payslip.id);
    try {
      const blob = await downloadPayslip(payslip.id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `payslip-${MONTHS[payslip.month - 1]}-${payslip.year}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError('Failed to download payslip.');
    } finally {
      setDownloading(null);
    }
  };

  if (loading)
    return (
      <div className='text-sm text-gray-400 py-10 text-center'>
        Loading payslips...
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
          <h3 className='font-semibold text-gray-800'>My Payslips</h3>
          <span className='text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full'>
            {payslips.length} {payslips.length === 1 ? 'payslip' : 'payslips'}
          </span>
        </div>

        {payslips.length === 0 ? (
          <p className='text-sm text-gray-400 text-center py-8'>
            No payslips uploaded yet. Contact HR if you believe this is an
            error.
          </p>
        ) : (
          <div className='overflow-x-auto'>
            <table className='w-full text-sm'>
              <thead>
                <tr className='border-b border-gray-100'>
                  <th className='text-left py-2 px-3 text-gray-500 font-medium'>
                    Month
                  </th>
                  <th className='text-left py-2 px-3 text-gray-500 font-medium'>
                    Year
                  </th>
                  <th className='text-left py-2 px-3 text-gray-500 font-medium'>
                    Uploaded
                  </th>
                  <th className='text-left py-2 px-3 text-gray-500 font-medium'></th>
                </tr>
              </thead>
              <tbody>
                {payslips.map((p) => (
                  <tr
                    key={p.id}
                    className='border-b border-gray-50 hover:bg-gray-50 transition-colors'
                  >
                    <td className='py-3 px-3 font-medium text-gray-800'>
                      {MONTHS[p.month - 1]}
                    </td>
                    <td className='py-3 px-3 text-gray-600'>{p.year}</td>
                    <td className='py-3 px-3 text-gray-400 text-xs whitespace-nowrap'>
                      {new Date(p.createdAt).toLocaleDateString('en-KE', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </td>
                    <td className='py-3 px-3 text-right whitespace-nowrap'>
                      <button
                        onClick={() => handleDownload(p)}
                        disabled={downloading === p.id}
                        className='bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50'
                      >
                        {downloading === p.id
                          ? 'Downloading...'
                          : 'Download PDF'}
                      </button>
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

export default MyPayslips;
