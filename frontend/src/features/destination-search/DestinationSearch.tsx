import { useState, type FormEvent } from 'react';
import Icon from '../../shared/ui/Icon';
import './DestinationSearch.css';

export default function DestinationSearch() {
  const [error, setError] = useState('');

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const city = String(formData.get('city') ?? '').trim();

    if (!city) {
      setError('Введіть назву міста або місця для пошуку.');
      return;
    }
    setError('');
    window.location.hash = `collection?city=${encodeURIComponent(city)}`;
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
            <input name="city" type="text" inputMode="search" placeholder="Місто або місце" aria-label="Місто або місце" />
          </label>
          <label className="field">
            <Icon className="field-icon" name="calendar" />
            <input name="date" type="text" placeholder="Дата (незабаром)" aria-label="Дата (незабаром)" disabled />
          </label>
          <label className="field">
            <Icon className="field-icon" name="users" />
            <input
              name="people"
              type="text"
              placeholder="Мандрівники (незабаром)"
              aria-label="Кількість мандрівників (незабаром)"
              inputMode="numeric"
              disabled
            />
          </label>
          <button type="submit">Пошук</button>
        </form>
        <div className="search-results" aria-live="polite">
          {error && <p className="search-message is-error" role="status">{error}</p>}
        </div>
      </div>
    </section>
  );
}
