import api from './api';

export const profileApi = {
  get: () => api.get('/profile').then((r) => r.data.user),
  update: (payload) => api.patch('/profile', payload).then((r) => r.data.user),
};

export default profileApi;
