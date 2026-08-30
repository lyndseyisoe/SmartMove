import api from './api';

export const notificationsApi = {
  list: () => api.get('/notifications').then((r) => Array.isArray(r.data) ? r.data : r.data.notifications || []),
  markRead: (id) => api.patch(`/notifications/${id}/read`).then((r) => r.data.notification),
};

export default notificationsApi;
