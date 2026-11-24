import { useEffect, useState, type FormEvent } from 'react';
import Icon from '../../shared/ui/Icon';
import { searchLocations, type Location } from '../../shared/api/locations';
import tokyoHero from './assets/tokyo-hero.png';
import tokyoMuseum from './assets/tokyo-museum.png';
import sensojiTemple from './assets/sensoji-temple.png';
import osakaCastle from './assets/osaka-castle.png';
import meijiShrine from './assets/meiji-shrine.png';
import './CurationPage.css';

type Props = { query: string };

const featuredPlaces = [
  { name: 'Токійський національний музей', image: tokyoMuseum, rating: '4,5', reviews: '426' },
  { name: 'Буддійський храм Сенсо-дзі', image: sensojiTemple, rating: '4,6', reviews: '510' },
  { name: 'Замок Осака', image: osakaCastle, rating: '4,4', reviews: '389' },
  { name: 'Храм Мейдзі', image: meijiShrine, rating: '4,7', reviews: '692' },
];

export default function CurationPage({ query }: Props) {
  const destination = query || 'Токіо';
  const isTokyo = /^(токіо|токио|tokyo)$/i.test(destination);
  const [input, setInput] = useState(destination);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [category, setCategory] = useState('');

  useEffect(() => setInput(destination), [destination]);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError('');
    setCategory('');
    void searchLocations(destination, controller.signal)
      .then((results) => setLocations(results))
      .catch((cause: unknown) => {
        if (cause instanceof Error && cause.name === 'AbortError') return;
        setLocations([]);
        setError('Не вдалося завантажити локації. Спробуйте ще раз пізніше.');
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [destination]);

  const categories = [...new Set(locations.map((location) => location.category).filter(Boolean))];
  const visibleLocations = category ? locations.filter((location) => location.category === category) : locations;

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const next = input.trim();
    if (!next) return;
    const nextHash = `#collection?city=${encodeURIComponent(next)}`;
    if (window.location.hash === nextHash) {
      setInput(next);
      return;
    }
    window.location.hash = nextHash;
  }

  return (
    <main className="curation-page">
      <section className={`curation-hero${isTokyo ? ' is-tokyo' : ''}`} aria-labelledby="curation-title">
        {isTokyo && <img className="curation-hero-image" src={tokyoHero} alt="Пагода, цвітіння сакури та гора Фудзі" />}
        <h1 id="curation-title">{isTokyo ? 'TOKYO' : destination.toLocaleUpperCase('uk')}</h1>
        <form className="curation-hero-fields" onSubmit={handleSearch} aria-label="Параметри подорожі">
          <label>
            <Icon name="location" />
            <input value={input} onChange={(event) => setInput(event.target.value)} aria-label="Місто або місце" />
          </label>
          <label>
            <Icon name="calendar" />
            <input value="Дати подорожі" aria-label="Дати подорожі — незабаром" disabled readOnly />
          </label>
          <label>
            <Icon name="users" />
            <input value="Мандрівники" aria-label="Мандрівники — незабаром" disabled readOnly />
          </label>
          <button className="sr-only" type="submit">Знайти локації</button>
        </form>
      </section>

      <section className="curation-results" id="collection-results" aria-labelledby="curation-results-title">
        <div className="curation-controls">
          <form className="curation-search" onSubmit={handleSearch}>
            <Icon name="location" />
            <input value={input} onChange={(event) => setInput(event.target.value)} placeholder="Місто або місце" aria-label="Пошук локацій" required />
            <button type="submit">Пошук</button>
          </form>
          <button className={`curation-filter-button${filtersOpen ? ' is-active' : ''}`} type="button" onClick={() => setFiltersOpen((open) => !open)} aria-expanded={filtersOpen} aria-controls="curation-filters">
            <span className="curation-filter-glyph" aria-hidden="true">☷</span>
            <span>Фільтри</span>
          </button>
        </div>
        {filtersOpen && (
          <div className="curation-filters" id="curation-filters">
            <label htmlFor="curation-category">Категорія</label>
            <select id="curation-category" value={category} onChange={(event) => setCategory(event.target.value)}>
              <option value="">Усі категорії</option>
              {categories.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </div>
        )}

        {isTokyo && (
          <section className="curation-featured" aria-labelledby="featured-title">
            <h2 id="featured-title">Культурні об’єкти та пам’ятки</h2>
            <div className="curation-featured-grid">
              {featuredPlaces.map((place) => (
                <article className="curation-featured-card" key={place.name}>
                  <div className="curation-featured-image">
                    <img src={place.image} alt={place.name} />
                    <button type="button" aria-label={`Зберегти ${place.name}`} onClick={() => { window.location.hash = '#login'; }}><Icon name="heart" /></button>
                  </div>
                  <h3>{place.name}</h3>
                  <p>{place.rating} <span className="curation-stars" aria-label="Рейтинг">★★★★★</span> <span>({place.reviews})</span></p>
                  <span className="curation-featured-category">Культурні об’єкти та пам’ятки</span>
                </article>
              ))}
            </div>
          </section>
        )}

        {(query || !isTokyo || visibleLocations.length > 0) && <><div className="curation-section-heading">
          <div>
            <p className="eyebrow">ВАША ПІДБІРКА</p>
            <h2 id="curation-results-title">Місця у напрямку «{destination}»</h2>
          </div>
          {!loading && !error && <span>{visibleLocations.length} локацій</span>}
        </div>
        <div className="curation-list" aria-live="polite" aria-busy={loading}>
          {loading && <p className="curation-state">Шукаємо цікаві місця…</p>}
          {error && <p className="curation-state" role="status">{error}</p>}
          {!loading && !error && visibleLocations.length === 0 && (
            <p className="curation-state" role="status">Поки що немає локацій для цього запиту. Спробуйте інше місто або змініть фільтр.</p>
          )}
          {!loading && !error && visibleLocations.map((location) => (
            <article className="curation-card" key={location.id}>
              <div className="curation-card-art" aria-hidden="true"><Icon name="map" /></div>
              <div className="curation-card-copy">
                <h3>{location.name}</h3>
                <p>{[location.city, location.country].filter(Boolean).join(', ')}</p>
                {location.category && <span>{location.category}</span>}
              </div>
            </article>
          ))}
        </div></>}
      </section>
    </main>
  );
}
