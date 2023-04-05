import React from 'react';
import { useAuth } from './components/authenticationProvider';
import './App.css';
function App() {
    const { user, isLogged, loading, logout, loginPopup } = useAuth();
    const renderContent = () => {
        if (loading) {
            return '';
        }
        return (React.createElement(React.Fragment, null,
            React.createElement("p", null,
                "Logged: ",
                `${isLogged}`),
            React.createElement("p", null, JSON.stringify(user))));
    };
    return (React.createElement("div", { className: 'App' },
        React.createElement("header", { className: 'App-header' },
            renderContent(),
            !isLogged && React.createElement("button", { onClick: loginPopup }, "Sign in"),
            isLogged && (React.createElement("button", { style: { marginTop: 12 }, onClick: logout }, "Logout")))));
}
export default App;
