import api from './api';

const moversApi = {
  list: (search = '') => api.get('/movers/', { params: search ? { search } : {} }).then((response) => response.data),
};

export default moversApi;
