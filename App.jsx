import React, { useState, useEffect } from 'react';
import StudyLMLanding from './StudyLM';
import Dashboard from './Dashboard';

export default function App() {
  const [route, setRoute] = useState(window.location.pathname);

  useEffect(() => {
    const handleLocationChange = () => {
      setRoute(window.location.pathname);
    };

    // Listen for custom pushstate events and browser back/forward (popstate)
    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('pushstate', handleLocationChange);

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('pushstate', handleLocationChange);
    };
  }, []);

  // Custom navigate function
  const navigate = (path) => {
    window.history.pushState({}, '', path);
    window.dispatchEvent(new Event('pushstate'));
  };

  if (route.startsWith('/dashboard')) {
    return <Dashboard navigate={navigate} />;
  }

  return <StudyLMLanding navigate={navigate} />;
}
