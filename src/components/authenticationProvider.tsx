import React from 'react';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import httpService from './httpService';
import { isEmpty } from 'lodash';
import AuthService from './authService';
import { User, UserManagerSettings } from 'oidc-client-ts';
import queryString from 'query-string';

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

const AuthenticationContext = createContext<AuthenticationContextI>({
  loading: false,
  isLogged: false,
  user: {} as any,
  initialPathName: '',
  accessToken: '',
  isLaunchFromApp: false,
  logout: () => {},
  loginPopup: () => {},
  loginPopupCallback: () => Promise.resolve({} as any),
  loginRedirect: () => {},
  loginRedirectCallback: () => Promise.resolve(),
  eventListener: () => {},
  postMessageToLauncher: () => {},
});

export const useAuth = () => useContext(AuthenticationContext);

const useGetUserInfo = ({ isTrigger = false, api = '' }: { isTrigger?: boolean; api?: string }) => {
  const [data, setData] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isTrigger) return;

    (async () => {
      try {
        setLoading(true);
        const response = await httpService.get(`${api}`);
        setData(response?.data as UserInfo);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    })();
  }, [isTrigger, api]);

  return { data, loading };
};

const AuthenticationProvider = ({
  children,
  config,
}: {
  children: any;
  config: UserManagerSettings & {
    launchUrl?: string;
    apiGetUserUrl?: string;
    logoutRedirectLink?: string;
  };
}) => {
  //! State
  const authService = useMemo(() => new AuthService(config), [config]);
  const query = queryString.parse(window.location.search);
  const token = query?.token as string;
  const idApp = query?.id as string;
  const isLaunchFromApp = !!token && !!idApp;

  const [isTokenAttached, setTokenAttached] = useState(false);
  const [userData, setUserData] = useState<User | null>(null);
  const [isCheckingAuth, setCheckingAuth] = useState(false);

  const accessToken = token || userData?.access_token || '';
  const { data: resUser, loading } = useGetUserInfo({
    isTrigger: !!accessToken && isTokenAttached,
    api: config?.apiGetUserUrl || '',
  });
  const user = resUser || null;

  const onGetUserDataSuccess = useCallback(
    ({ user, token }: { user?: User | null; token?: string }) => {
      if (user) {
        const accessToken = user?.access_token;
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
    },
    []
  );

  useEffect(() => {
    if (isLaunchFromApp) {
      onGetUserDataSuccess({ token });
      return;
    }

    (async () => {
      try {
        setCheckingAuth(true);
        const user = await authService.getUser();
        if (user) {
          onGetUserDataSuccess({ user });
        } else {
          const userStorage = httpService.getUserStorage();
          userStorage && onGetUserDataSuccess({ user: userStorage });
        }

        setCheckingAuth(false);
      } catch (error) {
        console.error(error);
        setCheckingAuth(false);
      }
    })();
  }, [onGetUserDataSuccess, isLaunchFromApp, token, authService]);

  const loginPopup = useCallback(async () => {
    try {
      const loginPopupBinded = authService.loginPopup.bind(authService);
      const user = await loginPopupBinded();
      if (user) {
        window.location.reload();
      }
    } catch (error) {
      console.error(error);
    }
  }, []);

  const loginRedirectCallback = useCallback(async () => {
    try {
      const user = await authService.loginRedirectCallback();
      if (user) {
        onGetUserDataSuccess({ user });
      }
    } catch (error) {
      console.error(error);
    }
  }, []);

  const postMessageToLauncher = useCallback(
    ({ action, value }: PostMessageI) => {
      if (parent) {
        parent.postMessage({ action, value, idApp }, config?.launchUrl || '');
      }
    },
    [idApp, config.launchUrl]
  );

  const logout = useCallback(async () => {
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
    } catch (error) {
      console.error(error);
    }
  }, [config.logoutRedirectLink, isLaunchFromApp, postMessageToLauncher, authService]);

  const eventListener = useCallback((cb: (e: any) => void) => {
    const addEventListener = window.addEventListener as any;
    const eventMethod = addEventListener ? 'addEventListener' : ('attachEvent' as any);
    const eventer = window[eventMethod] as any;
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

  return <AuthenticationContext.Provider value={value}>{children}</AuthenticationContext.Provider>;
};

export default AuthenticationProvider;
