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
        <path d="M-42.3561 53.5604L-69.2433 96.3077C-69.2433 96.3077 130.824 -4.24943 355.57 40.9947C630.432 96.3279 829.853 368.852 1099.91 399.686C1335.82 426.622 1382.41 255.12 1619.05 317.076C1821.22 370.01 1924.25 572.298 1924.25 572.298C1935.77 554.349 1945.86 536.924 1945.86 536.924C1945.86 536.924 1824.84 340.015 1615.74 286.645C1373.69 224.864 1345.76 398.005 1105.32 371.077C835.444 340.852 631.077 67.2449 356.074 12.9591Q129.606 -31.7459 -42.3561 53.5604Z" />
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
