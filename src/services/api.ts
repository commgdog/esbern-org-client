import axios, { AxiosResponse } from 'axios';
import useSession from '@/stores/session.js';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
});

const lastToken = sessionStorage.getItem('lastToken');
if (lastToken) {
  api.defaults.headers.common.Authorization = `Bearer ${lastToken}`;
}

api.interceptors.response.use((response) => {
  if (response.headers['x-token-expires']) {
    const session = useSession();
    session.sessionData.tokenExpires = response.headers['x-token-expires'];
    session.setRedirectTimeout();
  }
  return response;
});

export const parseErrorResponse = (response: AxiosResponse) => {
  let message;
  let errors = [];
  if (Array.isArray(response.data)) {
    errors = response.data;
    message = 'There are form errors present';
  } else if (response.data.message !== undefined) {
    message = response.data.message;
  } else {
    message = 'Server error';
  }
  return {
    message,
    errors,
  };
};

export default api;
