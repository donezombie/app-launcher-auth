import React, { useEffect } from 'react';

interface CallbackLogoutI {
  render?: React.ReactNode;
}

const CallbackLogout = ({ render }: CallbackLogoutI) => {
  useEffect(() => {
    window.location.href = '/';
  }, []);

  if (render) {
    return <>{render}</>;
  }

  return <div>Logout...</div>;
};

export default CallbackLogout;
