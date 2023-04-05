/// <reference types="react" />
import { UserManagerSettings } from 'oidc-client-ts';
export type ActionPostMessage = 'logout';
export type PostMessageActionsEnum = 'logout';
export interface PostMessageI {
    action: PostMessageActionsEnum;
    value: any;
}
export interface EventListenerI {
    data: {
        action: ActionPostMessage;
        idApp: string;
        value: any;
    };
}
export interface UserInfo {
    id: string;
    username: string;
    firstname: string;
    lastname: string;
    phoneNumber: string;
    email: string;
    company: string;
    address: string;
    roles: string[];
    isFirstTimeLogin: boolean;
}
interface AuthenticationContextI {
    loading: boolean;
    isLogged: boolean;
    user: UserInfo | null;
    initialPathName: string;
    accessToken: string;
    isLaunchFromApp: boolean;
    logout: () => void;
    loginPopup: () => void;
    loginPopupCallback: () => any;
    loginRedirect: () => void;
    loginRedirectCallback: () => void;
    eventListener: (e: any) => void;
    postMessageToLauncher: (arg: PostMessageI) => void;
}
export declare const useAuth: () => AuthenticationContextI;
declare const AuthenticationProvider: ({ children, config, }: {
    children: any;
    config: UserManagerSettings & {
        logoutRedirectLink?: string;
    };
}) => JSX.Element;
export default AuthenticationProvider;
