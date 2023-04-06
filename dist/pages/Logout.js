import React, { useEffect } from 'react';
const Logout = () => {
    useEffect(() => {
        window.location.href = '/';
    }, []);
    return React.createElement("div", null, "Logout...");
};
export default Logout;
