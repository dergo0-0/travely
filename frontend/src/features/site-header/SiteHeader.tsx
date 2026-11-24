import { useState } from 'react';
import BrandLogo from '../../shared/ui/BrandLogo';
import Icon from '../../shared/ui/Icon';
import './SiteHeader.css';

const navigationLinks = [
  { href: '#home', label: 'Головна сторінка' },
  { href: '#routes', label: 'Маршрути' },
  { href: '#destinations', label: 'Локації' },
  { href: '#news', label: 'Поради' },
  { href: '#about', label: 'Про сайт' },
];

type SiteHeaderProps = { username: string | null };

export default function SiteHeader({ username }: SiteHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="site-header">
      <a className="brand" href="#home" aria-label="TRAVELY — на головну">
        <BrandLogo className="brand-logo" />
      </a>
      <nav
        className={`main-nav${isMenuOpen ? ' is-open' : ''}`}
        id="main-navigation"
        aria-label="Головна навігація"
      >
        {navigationLinks.map(({ href, label }) => (
          <a key={href} href={href} onClick={() => setIsMenuOpen(false)}>
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
      <button
        className="menu-toggle"
        type="button"
        aria-label={isMenuOpen ? 'Закрити меню' : 'Відкрити меню'}
        aria-expanded={isMenuOpen}
        aria-controls="main-navigation"
        onClick={() => setIsMenuOpen((isOpen) => !isOpen)}
      >
        <Icon name={isMenuOpen ? 'close' : 'menu'} />
      </button>
    </header>
  );
}
