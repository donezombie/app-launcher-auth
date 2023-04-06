import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import AuthenticationProvider from './components/authenticationProvider';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import CallbackLogout from './components/CallbackLogout';
import CallbackLoginPopup from './components/CallbackLoginPopup';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(AuthenticationProvider, { config: {
        authority: 'https://cognito-idp.ap-southeast-1.amazonaws.com/ap-southeast-1_7wzWV6yyL',
        client_id: '6qudor4hlc22kqlqsjc8ct2cfg',
        client_secret: '4i64703bh2eo3rs5tobfkahkkmkf44su7ogvam2fr65hdk95605',
        redirect_uri: 'http://localhost:3001/login/callback',
        scope: 'openid email profile aws.cognito.signin.user.admin',
        response_type: 'code',
        apiGetUserUrl: 'https://betterhome-mvp.twenty-tech.com/api/user/get-user-info',
        launchUrl: 'http://localhost:3000',
        logoutRedirectLink: 'https://betterhome-mvp.auth.ap-southeast-1.amazoncognito.com/logout?client_id=6qudor4hlc22kqlqsjc8ct2cfg&logout_uri=http://localhost:3001/logout',
    } },
    React.createElement(BrowserRouter, null,
        React.createElement(Routes, null,
            React.createElement(Route, { path: '/', element: React.createElement(App, null) }),
            React.createElement(Route, { path: '/login/callback', element: React.createElement(CallbackLoginPopup, null) }),
            React.createElement(Route, { path: '/logout', element: React.createElement(CallbackLogout, null) })))));
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
