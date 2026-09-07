import api from './api';

const messagesApi = {
  conversations: () => api.get('/messages/conversations').then((response) => response.data),
  list: (bookingId) => api.get(`/messages/${bookingId}`).then((response) => response.data),
  send: (bookingId, body) => api.post(`/messages/${bookingId}`, { body }).then((response) => response.data.message),
};

export default messagesApi;
