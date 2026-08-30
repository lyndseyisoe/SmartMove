import api from './api';

export const moversApi = {
  list: () => api.get('/movers').then((r) => Array.isArray(r.data) ? r.data : r.data.movers || []),
};

export default moversApi;
