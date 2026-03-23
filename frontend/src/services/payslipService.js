import api from './api';

// Get current user's payslips
export const getMyPayslips = async () => {
  const response = await api.get('/payslips/me');
  return response.data;
}

// Download a payslip - returns a blob
export const downloadPayslip = async (id) => {
  const response = await api.get(`/payslips/${id}/download`, {
    responseType: 'blob'
  });
  return response.data;
}

// Upload a payslip - HR/Admin only
export const uploadPayslip = async (formData) => {
  const response = await api.post('/payslips/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
}

// Get all payslips - HR/Admin only
export const getAllPayslips = async () => {
  const response = await api.get('/payslips');
  return response.data;
}