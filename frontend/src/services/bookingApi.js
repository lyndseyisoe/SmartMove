import api from './api';
import { fromApiBooking, toApiBookingPayload } from './mappers/bookingMapper';

const bookingApi = {
  list: (params) =>
    api.get('/bookings/', { params }).then((r) => (Array.isArray(r.data) ? r.data : r.data.bookings || []).map(fromApiBooking)),

  getById: (id) => api.get(`/bookings/${id}`).then((r) => fromApiBooking(r.data.booking)),

  create: (payload) =>
    api.post('/bookings/', toApiBookingPayload(payload)).then((r) => fromApiBooking(r.data.booking)),

  update: (id, payload) =>
    api.patch(`/bookings/${id}`, toApiBookingPayload(payload)).then((r) => fromApiBooking(r.data.booking)),

  updateStatus: (id, status) =>
    api.patch(`/bookings/${id}`, { status }).then((r) => fromApiBooking(r.data.booking)),

  delete: (id) => api.delete(`/bookings/${id}`).then((r) => r.data),

  getDistance: (id) => api.get(`/bookings/${id}/distance`).then((r) => r.data),
};

export default bookingApi;
