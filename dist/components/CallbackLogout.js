import React, { useEffect } from 'react';
const CallbackLogout = ({ render }) => {
    useEffect(() => {
        window.location.href = '/';
    }, []);
    if (render) {
        return React.createElement(React.Fragment, null, render);
    }
    return React.createElement("div", null, "Logout...");
};
export default CallbackLogout;
