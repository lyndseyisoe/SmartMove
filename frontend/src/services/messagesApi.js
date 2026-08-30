import api from './api';

export const messagesApi = {
  list: () => api.get('/messages').then((r) => Array.isArray(r.data) ? r.data : r.data.messages || []),
  send: (payload) => api.post('/messages', payload).then((r) => r.data.message),
};

export default messagesApi;
