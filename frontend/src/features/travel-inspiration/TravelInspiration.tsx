import pisaClouds from './assets/pisa-clouds.webp';
import pisaTower from './assets/pisa-tower.webp';
import Icon from '../../shared/ui/Icon';
import './TravelInspiration.css';

export default function TravelInspiration() {
  return (
    <section className="discover-section" id="routes">
      <div className="discover-art" aria-hidden="true">
        <img src={pisaClouds} alt="" />
      </div>
      <img className="discover-tower" src={pisaTower} alt="" />
      <svg
        className="discover-route"
        viewBox="0 0 1920 573"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path d="M 48 67 C 142 7 252 -6 356 27 C 631 82 833 355 1103 385 C 1340 412 1380 240 1617 302 C 1818 355 1922 554 1970 590" />
      </svg>
      <span className="discover-pin discover-pin-map" aria-hidden="true">
        <Icon name="map" />
      </span>
      <span className="discover-pin discover-pin-location" aria-hidden="true">
        <Icon name="location" />
      </span>
      <svg
        className="flight-route"
        viewBox="0 0 220 240"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path d="M24 226C-1 178 31 130 81 110C128 91 169 118 160 153C153 181 120 186 96 161C58 122 39 77 52 43C67 4 180 -1 198 -1" />
      </svg>
      <Icon className="plane-icon" name="plane" />
      <div className="discover-copy" id="about">
        <h2>
          Знаєте місце, якого
          <br />
          ще немає на сайті?
        </h2>
        <p>
          Поділіться з іншими мандрівниками та допоможіть відкрити щось нове.
        </p>
        <a className="text-link" href="#contact">
          Додати локацію
        </a>
      </div>
    </section>
  );
}
