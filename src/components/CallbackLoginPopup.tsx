import React, { useEffect } from 'react';
import { useAuth } from '../components/authenticationProvider';

interface CallbackLoginPopupI {
  render?: React.ReactNode;
}

const CallbackLoginPopup = ({ render }: CallbackLoginPopupI) => {
  const auth = useAuth();

  useEffect(() => {
    auth.loginPopupCallback();
  }, [auth.loginPopupCallback]);

  if (render) {
    return <>{render}</>;
  }

  return <div>Login callback...</div>;
};

export default CallbackLoginPopup;
