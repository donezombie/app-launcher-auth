import React, { useEffect } from 'react';

const Logout = () => {
  useEffect(() => {
    window.location.href = '/';
  }, []);

  return <div>Logout...</div>;
};

export default Logout;
