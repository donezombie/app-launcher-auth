import React, { useEffect } from 'react';
import { useAuth } from '../components/authenticationProvider';
const Callback = () => {
    const auth = useAuth();
    useEffect(() => {
        console.log('ahihi');
        auth.loginPopupCallback();
    }, [auth.loginPopupCallback]);
    return React.createElement("div", null, "Login callback...");
};
export default Callback;
