import type { ApiResponse } from '@/modules/shared/types/api-types';
import axios from 'axios';
import Cookies from 'js-cookie';

export const TOKEN_COOKIE_KEY = 'access_token';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8001';

// No cliente, usa o proxy do Next.js. No servidor (SSR), chama o backend diretamente.
const isClient = typeof window !== 'undefined';
const CLIENT_PROXY_URL = '/api/proxy';

const apiClient = axios.create({
  baseURL: isClient ? CLIENT_PROXY_URL : API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: true,
});

export function getToken(): string | undefined {
  if (typeof window === 'undefined') return undefined;
  return Cookies.get(TOKEN_COOKIE_KEY);
}

export function setToken(token: string, expiresInSeconds?: number): void {
  const options: Cookies.CookieAttributes = {
    path: '/',
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  };
  if (expiresInSeconds) {
    options.expires = expiresInSeconds / 86_400; // js-cookie espera dias
  }
  Cookies.set(TOKEN_COOKIE_KEY, token, options);
}

export function removeToken(): void {
  Cookies.remove(TOKEN_COOKIE_KEY, { path: '/' });
}

// Interceptor de request: anexa JWT Bearer + Accept-Language
apiClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (typeof window !== 'undefined') {
      const locale = Cookies.get('NEXT_LOCALE') || localStorage.getItem('NEXT_LOCALE') || 'en';
      config.headers['Accept-Language'] = locale;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de response: auto-refresh do token em 401
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/auth/')
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return apiClient(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const currentToken = getToken();
        const refreshBaseUrl = isClient ? CLIENT_PROXY_URL : API_BASE_URL;
        const { data } = await axios.post<
          ApiResponse<{ access_token: string; token_type: string; expires_in: number }>
        >(
          `${refreshBaseUrl}/api/auth/v1/refresh`,
          {},
          {
            headers: {
              Authorization: `Bearer ${currentToken}`,
            },
          }
        );

        const newToken = data.data?.access_token;
        if (newToken) {
          setToken(newToken, data.data?.expires_in);
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          processQueue(null, newToken);
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        processQueue(refreshError, null);
        removeToken();
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export { apiClient };
