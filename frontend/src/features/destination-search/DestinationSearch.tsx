import { useState, type FormEvent } from 'react';
import Icon from '../../shared/ui/Icon';
import { searchLocations, type Location } from '../../shared/api/locations';
import './DestinationSearch.css';

export default function DestinationSearch() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const city = String(formData.get('city') ?? '').trim();

    if (!city) {
      setQuery('');
      setLocations([]);
      setHasSearched(false);
      setError('Введіть назву міста або місця для пошуку.');
      return;
    }

    setQuery(city);
    setIsLoading(true);
    setError('');
    setHasSearched(true);

    void searchLocations(city)
      .then(setLocations)
      .catch(() => {
        setLocations([]);
        setError('Не вдалося отримати локації. Перевірте, чи запущений API.');
      })
      .finally(() => setIsLoading(false));
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
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Шукаємо…' : 'Пошук'}
          </button>
        </form>
        <div className="search-results" aria-live="polite" aria-busy={isLoading}>
          {error && <p className="search-message is-error" role="status">{error}</p>}
          {!error && isLoading && <p className="search-message" role="status">Шукаємо «{query}»…</p>}
          {!error && hasSearched && !isLoading && locations.length === 0 && (
            <p className="search-message" role="status">Для «{query}» поки не знайшлося локацій.</p>
          )}
          {locations.length > 0 && (
            <div className="location-results">
              {locations.map((location) => (
                <article className="location-result" key={location.id}>
                  <div className="location-result-heading">
                    <h3>{location.name}</h3>
                    {location.category && <span>{location.category}</span>}
                  </div>
                  <p className="location-result-place">
                    {[location.city, location.country].filter(Boolean).join(', ')}
                  </p>
                  {location.description && <p>{location.description}</p>}
                  {location.address && <p className="location-result-address">{location.address}</p>}
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
