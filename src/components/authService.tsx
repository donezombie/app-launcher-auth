import { User, UserManager, UserManagerSettings } from 'oidc-client-ts';

class AuthService {
  userManager: UserManager;
  constructor(settings: UserManagerSettings) {
    this.userManager = new UserManager(settings);
  }

  getUser(): Promise<User | null> {
    return this.userManager.getUser();
  }

  login(): Promise<void> {
    return this.userManager.signinRedirect();
  }

  loginPopup(): Promise<User | null> {
    return this.userManager.signinPopup();
  }

  loginPopupCallback(): Promise<void> {
    return this.userManager.signinPopupCallback();
  }

  loginRedirect(): Promise<void> {
    return this.userManager.signinRedirect();
  }

  loginRedirectCallback(url?: string): Promise<User> {
    return this.userManager.signinRedirectCallback(url);
  }

  logout(): Promise<void> {
    return this.userManager.signoutRedirect();
  }

  removeUser(): Promise<void> {
    return this.userManager.removeUser();
  }
}

export default AuthService;
