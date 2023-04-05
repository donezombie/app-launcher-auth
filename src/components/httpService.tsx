import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { User } from 'oidc-client-ts';
import AuthService from './authService';
// import AuthService from './authService';

export const TOKEN_KEY = 'token';
export const USER_KEY = 'user';

class Services {
  axios: AxiosInstance;

  constructor() {
    this.axios = axios;
    this.axios.defaults.withCredentials = false;

    //! Interceptor request
    this.axios.interceptors.request.use(
      function (config) {
        return config;
      },
      function (error) {
        return Promise.reject(error);
      }
    );

    //! Interceptor response
    this.axios.interceptors.response.use(
      function (config) {
        return config;
      },
      function (error) {
        return Promise.reject(error);
      }
    );
  }

  setupInterceptors(authService: AuthService) {
    this.axios.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        const { status } = error?.response || {};
        if (status === 401) {
          authService.removeUser();
          this.clearAuthStorage();
          window.sessionStorage.clear();
        }
        return Promise.reject(error);
      }
    );
  }

  attachTokenToHeader(token: string) {
    this.axios.interceptors.request.use(
      function (config) {
        if (config.headers) {
          // Do something before request is sent
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      function (error) {
        return Promise.reject(error);
      }
    );
  }

  get(url: string, config?: AxiosRequestConfig) {
    return this.axios.get(url, config);
  }

  post(url: string, data: any, config?: AxiosRequestConfig) {
    return this.axios.post(url, data, config);
  }

  delete(url: string, config?: AxiosRequestConfig) {
    return this.axios.delete(url, config);
  }

  put(url: string, data: any, config?: AxiosRequestConfig) {
    return this.axios.put(url, data, config);
  }

  saveTokenStorage(token: string) {
    localStorage.setItem(TOKEN_KEY, token);
  }

  saveUserStorage(user: User) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  getTokenStorage() {
    const token = localStorage.getItem(TOKEN_KEY);
    return token || '';
  }

  getUserStorage() {
    const user = localStorage.getItem(USER_KEY);
    if (user && user !== 'null') {
      return JSON.parse(user);
    }

    return null;
  }

  clearAuthStorage() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }
}

export default new Services();
