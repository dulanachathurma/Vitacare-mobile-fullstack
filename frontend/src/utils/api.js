import axios from 'axios';

export const TOKEN_KEY = 'hp_token';
export const USER_KEY = 'hp_user';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// Attach the JWT to every request.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) config.headers.Authorization = 'Bearer ' + token;
  return config;
});

// If the token expires, clear the session and go back to the login screen.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthCall = (error.config?.url || '').includes('/auth/');
    if (error.response?.status === 401 && !isAuthCall) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

/** Returns the machine-readable error code sent by the API (used for translated messages). */
export const getErrorCode = (error) => error?.response?.data?.code || 'SERVER_ERROR';

export default api;
