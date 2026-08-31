import api from './api';

const paymentApi = {
  start: (bookingId, phoneNumber) => api.post('/payments/stk-push', { booking_id: bookingId, phone_number: phoneNumber }).then((response) => response.data),
  status: (paymentId) => api.get(`/payments/${paymentId}`).then((response) => response.data.payment),
};

export default paymentApi;
