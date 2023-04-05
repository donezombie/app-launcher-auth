import React from 'react';
import logo from './logo.svg';
import './App.css';
import { useAuth } from './components/authenticationProvider';

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
        <img src={logo} className='App-logo' alt='logo' />
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
