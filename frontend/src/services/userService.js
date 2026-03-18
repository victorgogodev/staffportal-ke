import api from './api';

// GET /api/users - fetch full profile from DB
export const getMe = async () => {
  const response = await api.get('/users');
  return response.data;
}

// PATCH /api/users - update personal info
export const updateMe = async (data) => {
  const response = await api.patch('/users', data);
  return response.data;
}