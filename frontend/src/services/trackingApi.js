import api from './api';

const trackingApi = {
  list: (bookingId) => api.get(`/tracking/booking/${bookingId}`).then((r) => r.data),
  create: (bookingId, payload) => api.post(`/tracking/booking/${bookingId}`, payload).then((r) => r.data),
  update: (itemId, payload) => api.patch(`/tracking/${itemId}`, payload).then((r) => r.data),
  remove: (itemId) => api.delete(`/tracking/${itemId}`).then((r) => r.data),
};

export default trackingApi;
