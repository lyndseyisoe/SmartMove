import api from './api';

export const reviewsApi = {
  list: (params) => api.get('/reviews', { params }).then((r) => Array.isArray(r.data) ? r.data : r.data.reviews || []),
  create: (payload) => api.post('/reviews', payload).then((r) => r.data.review),
};

export default reviewsApi;
