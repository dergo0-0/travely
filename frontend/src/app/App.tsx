import SiteFooter from '../features/site-footer/SiteFooter';
import SiteHeader from '../features/site-header/SiteHeader';
import DestinationSearch from '../features/destination-search/DestinationSearch';
import Hero from '../features/hero/Hero';
import TravelInspiration from '../features/travel-inspiration/TravelInspiration';

export default function App() {
  return (
    <>
      <SiteHeader />
      <main id="home">
        <Hero />
        <DestinationSearch />
        <TravelInspiration />
      </main>
      <SiteFooter />
    </>
  );
}
