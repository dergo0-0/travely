import BrandLogo from '../../shared/ui/BrandLogo';
import './SiteHeader.css';

const navigationLinks = [
  { href: '#home', label: 'Головна сторінка' },
  { href: '#collection', label: 'Маршрути' },
  { href: '#destinations', label: 'Локації' },
  { href: '#news', label: 'Поради' },
  { href: '#about', label: 'Про сайт' },
];

type SiteHeaderProps = { username: string | null; isPaused: boolean };

export default function SiteHeader({ username, isPaused }: SiteHeaderProps) {
  return (
    <header className={`site-header${isPaused ? ' is-paused' : ''}`} aria-hidden={isPaused} inert={isPaused}>
      <a className="brand" href="#home" aria-label="TRAVELY — на головну">
        <BrandLogo className="brand-logo" />
      </a>
      <nav className="main-nav" id="main-navigation" aria-label="Головна навігація">
        {navigationLinks.map(({ href, label }) => (
          <a key={href} href={href}>
            {label}
          </a>
        ))}
      </nav>
      <div className="header-actions">
        {username ? <a className="header-login" href="#account" aria-label={`Профіль: ${username}`}>Профіль</a> : <>
          <a className="header-login" href="#login">Увійти</a>
          <a className="header-register" href="#register">Зареєструватися</a>
        </>}
      </div>
    </header>
  );
}
