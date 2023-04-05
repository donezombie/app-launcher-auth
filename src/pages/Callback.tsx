import React, { useEffect } from 'react';
import { useAuth } from '../components/authenticationProvider';

const Callback = () => {
  const auth = useAuth();

  useEffect(() => {
    console.log('ahihi');
    auth.loginPopupCallback();
  }, [auth.loginPopupCallback]);

  return <div>Login callback...</div>;
};

export default Callback;
