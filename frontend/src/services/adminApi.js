import api from './api';

export const adminApi = {
  getUsers: () => api.get('/admin/users').then((r) => Array.isArray(r.data) ? r.data : r.data.users || []),
  getMovers: () => api.get('/admin/movers').then((r) => Array.isArray(r.data) ? r.data : r.data.movers || []),
  approveMover: (id) => api.patch(`/admin/movers/${id}/approve`).then((r) => r.data),
  getReports: () => api.get('/admin/reports').then((r) => r.data),
};

export default adminApi;
