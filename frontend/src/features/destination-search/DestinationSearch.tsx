import type { FormEvent } from 'react';
import Icon from '../../shared/ui/Icon';
import './DestinationSearch.css';

export default function DestinationSearch() {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const city = String(formData.get('city') ?? '').trim();

    if (city) {
      window.alert(`Шукаємо напрямки для подорожі: ${city}`);
      return;
    }

    window.alert('Спочатку введіть місто для подорожі.');
  }

  return (
    <section className="search-section" id="destinations">
      <div className="search-content">
        <p className="eyebrow light">ТВОЯ НАСТУПНА ПРИГОДА</p>
        <h2>ОБЕРІТЬ НАПРЯМОК</h2>
        <p className="search-intro">
          Знаходьте цікаві місця, збирайте ідеї та відкривайте світ по-новому.
        </p>
        <form className="search-form" onSubmit={handleSubmit}>
          <label className="field">
            <Icon className="field-icon" name="location" />
            <input name="city" type="text" placeholder="Місто" aria-label="Місто" />
          </label>
          <label className="field">
            <Icon className="field-icon" name="calendar" />
            <input name="date" type="text" placeholder="Дата" aria-label="Дата" />
          </label>
          <label className="field">
            <Icon className="field-icon" name="users" />
            <input
              name="people"
              type="text"
              placeholder="Люди"
              aria-label="Кількість людей"
              inputMode="numeric"
            />
          </label>
          <button type="submit">Пошук</button>
        </form>
      </div>
    </section>
  );
}
