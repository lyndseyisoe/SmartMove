import axios from 'axios';

let authToken = null;

export function setAuthToken(token) {
  authToken = token || null;
}

export function getAuthToken() {
  return authToken;
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }
  return config;
});

export function normalizeError(error) {
  if (error.response) {
    const { status, data } = error.response;
    let message = data?.message || data?.error || defaultMessageForStatus(status);
    if (Array.isArray(data?.fields) && data.fields.length > 0) {
      message = `${message}: ${data.fields.join(', ')}`;
    }
    return {
      status,
      message,
      errors: data?.errors || null,
    };
  }
  if (error.request) {
    return { status: 0, message: 'Network error — check your connection and try again.', errors: null };
  }
  return { status: -1, message: error.message || 'Something went wrong.', errors: null };
}

function defaultMessageForStatus(status) {
  switch (status) {
    case 400:
      return 'That request could not be processed.';
    case 401:
      return 'Please log in to continue.';
    case 403:
      return "You don't have permission to do that.";
    case 404:
      return 'We could not find what you were looking for.';
    case 409:
      return 'That already exists.';
    case 422:
      return 'Please check the highlighted fields.';
    case 500:
      return 'Something went wrong on our end. Please try again.';
    default:
      return 'Something went wrong.';
  }
}
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !error.config?.url?.includes('/auth/me')) {
      window.dispatchEvent(new CustomEvent('smartmove:unauthorized'));
    }
    return Promise.reject(error);
  }
);

export default api;
