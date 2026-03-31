import api from './api';

const getNotifications = () => api.get('/notifications').then((r) => r.data);
const markOneRead = (id) =>
  api.patch(`/notifications/${id}/read`).then((r) => r.data);
const markAllRead = () =>
  api.patch('/notifications/read-all').then((r) => r.data);

export default {
  getNotifications,
  markOneRead,
  markAllRead
};
