import londonWaterfront from './assets/london-cutout.png';
import Icon from '../../shared/ui/Icon';
import './Hero.css';

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-copy">
        <h1>Відкрий світ</h1>
        <p className="hero-description">
          Знайди місця, які зроблять
          <br />
          подорож особливою.
        </p>
        <span className="hero-scroll" aria-hidden="true">
          <Icon name="arrow-down" />
        </span>
        <a className="hero-photo-cta" href="#locations">
          Куди хочете поїхати? <Icon name="arrow-up-right" />
        </a>
      </div>
      <div className="hero-photo">
        <svg className="hero-route" viewBox="0 0 1920 945" preserveAspectRatio="none" aria-hidden="true">
          <path d="M-60 995 C90 730 255 555 430 585 C730 595 1040 585 1260 540 C1315 480 1330 260 1380 205 C1500 40 1720 -30 1980 185" />
        </svg>
        <img
          src={londonWaterfront}
          alt="Панорама Лондона з колесом огляду"
        />
        <span className="map-pin pin-one" aria-hidden="true">
          <Icon name="map" />
        </span>
        <span className="map-pin pin-two" aria-hidden="true">
          <Icon name="location" />
        </span>
      </div>
    </section>
  );
}
