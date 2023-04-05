import { User, UserManager, UserManagerSettings } from 'oidc-client-ts';
declare class AuthService {
    userManager: UserManager;
    constructor(settings: UserManagerSettings);
    getUser(): Promise<User | null>;
    login(): Promise<void>;
    loginPopup(): Promise<User | null>;
    loginPopupCallback(): Promise<void>;
    loginRedirect(): Promise<void>;
    loginRedirectCallback(url?: string): Promise<User>;
    logout(): Promise<void>;
    removeUser(): Promise<void>;
}
export default AuthService;
