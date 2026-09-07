import api from './api';

const moverProfileApi = {
  get: () => api.get('/movers/me').then((response) => response.data.profile),
  save: (payload) => api.put('/movers/me', payload).then((response) => response.data.profile),
};

export default moverProfileApi;
