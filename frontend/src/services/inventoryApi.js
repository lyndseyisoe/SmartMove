import api from './api';

export const inventoryApi = {
  list: () => api.get('/inventory').then((r) => Array.isArray(r.data) ? r.data : r.data.inventory || []),
  create: (payload) => api.post('/inventory', payload).then((r) => r.data.item),
};

export default inventoryApi;
