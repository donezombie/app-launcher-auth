import React, { useEffect } from 'react';
import { useAuth } from '../components/authenticationProvider';
const CallbackLoginPopup = ({ render }) => {
    const auth = useAuth();
    useEffect(() => {
        auth.loginPopupCallback();
    }, [auth.loginPopupCallback]);
    if (render) {
        return React.createElement(React.Fragment, null, render);
    }
    return React.createElement("div", null, "Login callback...");
};
export default CallbackLoginPopup;
