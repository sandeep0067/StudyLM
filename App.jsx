import React, { useState, useEffect } from 'react';
import MeridianLanding from './Meridian';
import Dashboard from './Dashboard';

export default function App() {
  const [route, setRoute] = useState(window.location.pathname);

  useEffect(() => {
    const handleLocationChange = () => {
      setRoute(window.location.pathname);
    };
    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('pushstate', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('pushstate', handleLocationChange);
    };
  }, []);

  useEffect(() => {
    if (route.startsWith('/dashboard')) {
      document.body.classList.remove('landing-mode');
    } else {
      document.body.classList.add('landing-mode');
    }
  }, [route]);

  // Custom navigate function
  const navigate = (path) => {
    window.history.pushState({}, '', path);
    window.dispatchEvent(new Event('pushstate'));
  };

  if (route.startsWith('/dashboard')) {
    return <Dashboard navigate={navigate} />;
  }

  return <MeridianLanding navigate={navigate} />;
}
