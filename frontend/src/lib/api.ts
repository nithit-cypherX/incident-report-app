import axios from 'axios';
import type { AxiosRequestConfig } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});


api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.error || 'Something went wrong';
    return Promise.reject(new Error(message));
  }
);


export async function apiClient<T>(
  endpoint: string,
  options?: AxiosRequestConfig
): Promise<T> {
  const response = await api(endpoint, options);
  return response.data;
}