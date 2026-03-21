import api from './api';

// Submit a new leave request
export const createLeave = async (data) => {
  const response = await api.post('/leaves', data);
  return response.data;
}

// Get current user's leave history
export const getMyLeaves = async () => {
  const response = await api.get('/leaves/me');
  return response.data;
}

// Get all leaves - Manager/HR/Admin only
export const getAllLeaves = async () => {
  const response = await api.get('/leaves');
  return response.data;
}

// Approve a leave
export const approveLeave = async (id) => {
  const response = await api.patch(`/leaves/${id}/approve`);
  return response.data;
}

// Reject a leave with a reason
export const rejectLeave = async (id, reviewNote) => {
  const response = await api.patch(`/leaves/${id}/reject`, { reviewNote });
  return response.data;
}