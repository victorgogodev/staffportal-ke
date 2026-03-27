import api from './api';

export const getAuditLogs = async (page = 1, limit = 20) => {
  const response = await api.get(`/audit?page=${page}&limit=${limit}`);
  return response.data;
};
