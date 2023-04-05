import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import AuthenticationProvider from './components/authenticationProvider';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Callback from './pages/Callback';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <AuthenticationProvider
    config={{
      authority: 'https://cognito-idp.ap-southeast-1.amazonaws.com/ap-southeast-1_7wzWV6yyL',
      client_id: '6qudor4hlc22kqlqsjc8ct2cfg',
      client_secret: '4i64703bh2eo3rs5tobfkahkkmkf44su7ogvam2fr65hdk95605',
      redirect_uri: 'http://localhost:3001/login/callback',
      scope: 'openid email profile aws.cognito.signin.user.admin',
      response_type: 'code',
    }}
  >
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<App />} />
        <Route path='/login/callback' element={<Callback />} />
      </Routes>
    </BrowserRouter>
  </AuthenticationProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
