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
      </div>
      <div className="hero-photo">
        <img
          src={londonWaterfront}
          alt="Панорама Лондона з колесом огляду"
        />
        <a className="hero-photo-cta" href="#destinations">
          Куди хочете поїхати? <Icon name="arrow-up-right" />
        </a>
        <span className="map-pin pin-one" aria-hidden="true">
          <Icon name="map" />
        </span>
        <span className="map-pin pin-two" aria-hidden="true">
          <Icon name="location" />
        </span>
      </div>
      <svg
        className="hero-route"
        viewBox="0 0 1000 190"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path d="M-20 165 C120 65 165 100 300 110 C420 118 480 80 585 44 C710 2 790 8 870 30 S965 78 1030 12" />
      </svg>
    </section>
  );
}
