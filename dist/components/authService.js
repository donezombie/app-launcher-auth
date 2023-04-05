import { UserManager } from 'oidc-client-ts';
class AuthService {
    constructor(settings) {
        this.userManager = new UserManager(settings);
    }
    getUser() {
        return this.userManager.getUser();
    }
    login() {
        return this.userManager.signinRedirect();
    }
    loginPopup() {
        return this.userManager.signinPopup();
    }
    loginPopupCallback() {
        return this.userManager.signinPopupCallback();
    }
    loginRedirect() {
        return this.userManager.signinRedirect();
    }
    loginRedirectCallback(url) {
        return this.userManager.signinRedirectCallback(url);
    }
    logout() {
        return this.userManager.signoutRedirect();
    }
    removeUser() {
        return this.userManager.removeUser();
    }
}
export default AuthService;
