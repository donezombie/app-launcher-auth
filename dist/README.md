# App Laucher Auth - Usage

## Example
You may be using [Example](https://github.com/donezombie/auth-example.git).

## index.tsx
```
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import {
  AuthenticationProvider,
  CallbackLoginPopup,
  CallbackLogout,
} from "app-launcher-auth";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <AuthenticationProvider
    config={{
      authority:
        "https://cognito-idp.ap-southeast-1.amazonaws.com/ap-southeast-1_7wzWV6yyL",
      client_id: "6qudor4hlc22kqlqsjc8ct2cfg",
      client_secret: "4i64703bh2eo3rs5tobfkahkkmkf44su7ogvam2fr65hdk95605",
      redirect_uri: "http://localhost:3001/login/callback",
      scope: "openid email profile aws.cognito.signin.user.admin",
      response_type: "code",
      logoutRedirectLink:
        "https://betterhome-mvp.auth.ap-southeast-1.amazoncognito.com/logout?client_id=6qudor4hlc22kqlqsjc8ct2cfg&logout_uri=http://localhost:3001/logout",
      apiGetUserUrl: `https://betterhome-mvp.twenty-tech.com/api/user/get-user-info`,
    }}
  >
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login/callback" element={<CallbackLoginPopup />} />
        <Route path="/logout" element={<CallbackLogout />} />
      </Routes>
    </BrowserRouter>
  </AuthenticationProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
```

## other-component.tsx
```
import logo from './logo.svg';
import './App.css';
import { useAuth } from 'app-launcher-auth';

function App() {
  const { user, isLogged, loading, logout, loginPopup } = useAuth();

  const renderContent = () => {
    if (loading) {
      return '';
    }

    return (
      <>
        <p>Logged: {`${isLogged}`}</p>
        <p>{JSON.stringify(user)}</p>
      </>
    );
  };

  return (
    <div className='App'>
      <header className='App-header'>
        {renderContent()}

        {!isLogged && <button onClick={loginPopup}>Sign in</button>}
        {isLogged && (
          <button style={{ marginTop: 12 }} onClick={logout}>
            Logout
          </button>
        )}
      </header>
    </div>
  );
}

export default App;
```