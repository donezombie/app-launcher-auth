import axios from 'axios';
// import AuthService from './authService';
export const TOKEN_KEY = 'token';
export const USER_KEY = 'user';
class Services {
    constructor() {
        this.axios = axios;
        this.axios.defaults.withCredentials = false;
        //! Interceptor request
        this.axios.interceptors.request.use(function (config) {
            return config;
        }, function (error) {
            return Promise.reject(error);
        });
        //! Interceptor response
        this.axios.interceptors.response.use(function (config) {
            return config;
        }, function (error) {
            return Promise.reject(error);
        });
    }
    setupInterceptors(authService) {
        this.axios.interceptors.response.use((response) => {
            return response;
        }, (error) => {
            const { status } = (error === null || error === void 0 ? void 0 : error.response) || {};
            if (status === 401) {
                authService.removeUser();
                this.clearAuthStorage();
                window.sessionStorage.clear();
            }
            return Promise.reject(error);
        });
    }
    attachTokenToHeader(token) {
        this.axios.interceptors.request.use(function (config) {
            if (config.headers) {
                // Do something before request is sent
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        }, function (error) {
            return Promise.reject(error);
        });
    }
    get(url, config) {
        return this.axios.get(url, config);
    }
    post(url, data, config) {
        return this.axios.post(url, data, config);
    }
    delete(url, config) {
        return this.axios.delete(url, config);
    }
    put(url, data, config) {
        return this.axios.put(url, data, config);
    }
    saveTokenStorage(token) {
        localStorage.setItem(TOKEN_KEY, token);
    }
    saveUserStorage(user) {
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
