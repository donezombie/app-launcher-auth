import { AxiosInstance, AxiosRequestConfig } from 'axios';
import { User } from 'oidc-client-ts';
import AuthService from './authService';
export declare const TOKEN_KEY = "token";
export declare const USER_KEY = "user";
declare class Services {
    axios: AxiosInstance;
    constructor();
    setupInterceptors(authService: AuthService): void;
    attachTokenToHeader(token: string): void;
    get(url: string, config?: AxiosRequestConfig): Promise<import("axios").AxiosResponse<any, any>>;
    post(url: string, data: any, config?: AxiosRequestConfig): Promise<import("axios").AxiosResponse<any, any>>;
    delete(url: string, config?: AxiosRequestConfig): Promise<import("axios").AxiosResponse<any, any>>;
    put(url: string, data: any, config?: AxiosRequestConfig): Promise<import("axios").AxiosResponse<any, any>>;
    saveTokenStorage(token: string): void;
    saveUserStorage(user: User): void;
    getTokenStorage(): string;
    getUserStorage(): any;
    clearAuthStorage(): void;
}
declare const _default: Services;
export default _default;
