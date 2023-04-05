import React from 'react';
import { useAuth } from './components/authenticationProvider';
import './App.css';

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
