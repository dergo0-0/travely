import { useEffect, useState } from 'react';
import AuthPage from '../features/authentication/AuthPage';
import SiteFooter from '../features/site-footer/SiteFooter';
import SiteHeader from '../features/site-header/SiteHeader';
import DestinationSearch from '../features/destination-search/DestinationSearch';
import Hero from '../features/hero/Hero';
import TravelInspiration from '../features/travel-inspiration/TravelInspiration';
import { getSessionUsername } from '../shared/api/client';

export default function App() {
  const [route, setRoute] = useState(window.location.hash || '#home');
  const [username, setUsername] = useState<string | null>(() => getSessionUsername());

  useEffect(() => {
    function syncLocation() {
      setRoute(window.location.hash || '#home');
      setUsername(getSessionUsername());
    }

    window.addEventListener('hashchange', syncLocation);
    return () => window.removeEventListener('hashchange', syncLocation);
  }, []);

  if (route === '#login' || route === '#register' || route === '#account') {
    const mode = route.slice(1) as 'login' | 'register' | 'account';
    return (
      <AuthPage
        mode={mode}
        username={username}
        onSuccess={(signedInUser) => {
          setUsername(signedInUser);
          window.location.hash = '#home';
        }}
        onSignOut={() => {
          setUsername(null);
          window.location.hash = '#home';
        }}
      />
    );
  }

  return (
    <>
      <SiteHeader username={username} />
      <main id="home">
        <Hero />
        <DestinationSearch />
        <TravelInspiration />
      </main>
      <SiteFooter />
    </>
  );
}
