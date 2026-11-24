import { useCallback, useEffect, useRef, useState } from 'react';
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
  const [isDeepPaused, setIsDeepPaused] = useState(false);
  const previousPageHash = useRef('#home');
  const isAuthOpen = route === '#login' || route === '#register' || route === '#account';
  const mode = isAuthOpen ? route.slice(1) as 'login' | 'register' | 'account' : 'login';
  const closeAuth = useCallback(() => {
    const pageHash = previousPageHash.current;
    window.history.replaceState(window.history.state, '', pageHash);
    setRoute(pageHash);
  }, []);

  useEffect(() => {
    function syncLocation() {
      setRoute(window.location.hash || '#home');
      setUsername(getSessionUsername());
    }

    window.addEventListener('hashchange', syncLocation);
    return () => window.removeEventListener('hashchange', syncLocation);
  }, []);

  useEffect(() => {
    if (!isAuthOpen) previousPageHash.current = route;
  }, [isAuthOpen, route]);

  useEffect(() => {
    if (!isAuthOpen) {
      setIsDeepPaused(false);
      return;
    }
    const timer = window.setTimeout(() => setIsDeepPaused(true), 1800);
    return () => window.clearTimeout(timer);
  }, [isAuthOpen]);

  return (
    <>
      <SiteHeader username={username} isPaused={isAuthOpen} />
      <div className={`site-content${isAuthOpen ? ' is-paused' : ''}${isAuthOpen && isDeepPaused ? ' is-deep-paused' : ''}`} aria-hidden={isAuthOpen}>
        <main id="home">
          <Hero />
          <DestinationSearch />
          <TravelInspiration />
        </main>
        <SiteFooter />
      </div>
      <AuthPage
        open={isAuthOpen}
        mode={mode}
        username={username}
        onClose={closeAuth}
        onSuccess={(signedInUser) => {
          setUsername(signedInUser);
          closeAuth();
        }}
        onSignOut={() => {
          setUsername(null);
          closeAuth();
        }}
      />
    </>
  );
}
