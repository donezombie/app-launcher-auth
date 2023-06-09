var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import React from 'react';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import httpService from './httpService';
import { isEmpty } from 'lodash';
import AuthService from './authService';
import queryString from 'query-string';
const AuthenticationContext = createContext({
    loading: false,
    isLogged: false,
    user: {},
    initialPathName: '',
    accessToken: '',
    isLaunchFromApp: false,
    logout: () => { },
    loginPopup: () => { },
    loginPopupCallback: () => Promise.resolve({}),
    loginRedirect: () => { },
    loginRedirectCallback: () => Promise.resolve(),
    eventListener: () => { },
    postMessageToLauncher: () => { },
});
export const useAuth = () => useContext(AuthenticationContext);
const useGetUserInfo = ({ isTrigger = false, api = '' }) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        if (!isTrigger)
            return;
        (() => __awaiter(void 0, void 0, void 0, function* () {
            try {
                setLoading(true);
                const response = yield httpService.get(`${api}`);
                setData(response === null || response === void 0 ? void 0 : response.data);
                setLoading(false);
            }
            catch (error) {
                setLoading(false);
            }
        }))();
    }, [isTrigger, api]);
    return { data, loading };
};
const AuthenticationProvider = ({ children, config, }) => {
    //! State
    const authService = useMemo(() => new AuthService(config), [config]);
    const query = queryString.parse(window.location.search);
    const token = query === null || query === void 0 ? void 0 : query.token;
    const idApp = query === null || query === void 0 ? void 0 : query.id;
    const isLaunchFromApp = !!token && !!idApp;
    const [isTokenAttached, setTokenAttached] = useState(false);
    const [userData, setUserData] = useState(null);
    const [isCheckingAuth, setCheckingAuth] = useState(false);
    const accessToken = token || (userData === null || userData === void 0 ? void 0 : userData.access_token) || '';
    const { data: resUser, loading } = useGetUserInfo({
        isTrigger: !!accessToken && isTokenAttached,
        api: (config === null || config === void 0 ? void 0 : config.apiGetUserUrl) || '',
    });
    const user = resUser || null;
    const onGetUserDataSuccess = useCallback(({ user, token }) => {
        if (user) {
            const accessToken = user === null || user === void 0 ? void 0 : user.access_token;
            httpService.saveUserStorage(user);
            httpService.saveTokenStorage(accessToken);
            httpService.attachTokenToHeader(accessToken);
            setTokenAttached(true);
            setUserData(user);
        }
        if (token) {
            httpService.saveTokenStorage(accessToken);
            httpService.attachTokenToHeader(accessToken);
            setTokenAttached(true);
        }
    }, []);
    useEffect(() => {
        if (isLaunchFromApp) {
            onGetUserDataSuccess({ token });
            return;
        }
        (() => __awaiter(void 0, void 0, void 0, function* () {
            try {
                setCheckingAuth(true);
                const user = yield authService.getUser();
                if (user) {
                    onGetUserDataSuccess({ user });
                }
                else {
                    const userStorage = httpService.getUserStorage();
                    userStorage && onGetUserDataSuccess({ user: userStorage });
                }
                setCheckingAuth(false);
            }
            catch (error) {
                console.error(error);
                setCheckingAuth(false);
            }
        }))();
    }, [onGetUserDataSuccess, isLaunchFromApp, token, authService]);
    const loginPopup = useCallback(() => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const loginPopupBinded = authService.loginPopup.bind(authService);
            const user = yield loginPopupBinded();
            if (user) {
                window.location.reload();
            }
        }
        catch (error) {
            console.error(error);
        }
    }), []);
    const loginRedirectCallback = useCallback(() => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const user = yield authService.loginRedirectCallback();
            if (user) {
                onGetUserDataSuccess({ user });
            }
        }
        catch (error) {
            console.error(error);
        }
    }), []);
    const postMessageToLauncher = useCallback(({ action, value }) => {
        if (parent) {
            parent.postMessage({ action, value, idApp }, (config === null || config === void 0 ? void 0 : config.launchUrl) || '');
        }
    }, [idApp, config.launchUrl]);
    const logout = useCallback(() => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (isLaunchFromApp) {
                postMessageToLauncher({ action: 'logout', value: '' });
                return;
            }
            authService.removeUser();
            httpService.clearAuthStorage();
            window.sessionStorage.clear();
            if (config.logoutRedirectLink) {
                window.location.href = config.logoutRedirectLink;
            }
        }
        catch (error) {
            console.error(error);
        }
    }), [config.logoutRedirectLink, isLaunchFromApp, postMessageToLauncher, authService]);
    const eventListener = useCallback((cb) => {
        const addEventListener = window.addEventListener;
        const eventMethod = addEventListener ? 'addEventListener' : 'attachEvent';
        const eventer = window[eventMethod];
        const messageEvent = eventMethod == 'attachEvent' ? 'onmessage' : 'message';
        eventer(messageEvent, cb, false);
    }, []);
    //! Return
    const value = useMemo(() => {
        return {
            accessToken,
            loading: isCheckingAuth || loading,
            isLogged: !isEmpty(user),
            user,
            initialPathName: '',
            isLaunchFromApp,
            eventListener,
            postMessageToLauncher,
            loginRedirect: authService.loginRedirect.bind(authService),
            loginPopupCallback: authService.loginPopupCallback.bind(authService),
            loginRedirectCallback,
            loginPopup,
            logout,
        };
    }, [
        user,
        isCheckingAuth,
        loading,
        authService,
        accessToken,
        isLaunchFromApp,
        loginRedirectCallback,
        loginPopup,
        eventListener,
        postMessageToLauncher,
        logout,
    ]);
    return React.createElement(AuthenticationContext.Provider, { value: value }, children);
};
export default AuthenticationProvider;
