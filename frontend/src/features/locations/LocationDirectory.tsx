import { useEffect, useState } from 'react';
import { searchLocations, type Location } from '../../shared/api/locations';
import './LocationDirectory.css';

type Props = { username: string | null };

export default function LocationDirectory({ username }: Props) {
  const [query, setQuery] = useState('');
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError('');
    const timer = window.setTimeout(() => {
      void searchLocations(query.trim(), controller.signal)
        .then(setLocations)
        .catch((cause: unknown) => {
          if (cause instanceof Error && cause.name === 'AbortError') return;
          setError('Не вдалося завантажити локації. Спробуйте ще раз.');
        })
        .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    }, query ? 250 : 0);
    return () => { window.clearTimeout(timer); controller.abort(); };
  }, [query]);

  return <main className="location-directory">
    <div className="location-directory-heading">
      <div><p className="eyebrow">ВІДКРИВАЙТЕ СВІТ</p><h1>Локації мандрівників</h1><p>Знайдіть місце для наступної подорожі або поділіться власною знахідкою.</p></div>
      <a className="location-directory-add" href={username ? '#location/new' : '#register'}>Додати локацію</a>
    </div>
    <label className="location-directory-search">
      <span className="sr-only">Пошук локацій</span>
      <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Пошук за назвою, містом або країною" />
    </label>
    <div className="location-directory-results" aria-live="polite" aria-busy={loading}>
      {loading && <p className="location-directory-state">Шукаємо локації…</p>}
      {error && <p className="location-directory-state" role="status">{error}</p>}
      {!loading && !error && locations.length === 0 && <div className="location-directory-state"><p>За цим запитом локацій поки немає.</p><a href={username ? '#location/new' : '#register'}>Додати першу локацію</a></div>}
      {!loading && !error && locations.map((location) => <a className="location-directory-card" href={`#location?id=${location.id}`} key={location.id}>
        <span className="location-directory-card-art" aria-hidden="true">⌖</span>
        <span className="location-directory-card-copy"><strong>{location.name}</strong><span>{[location.city, location.country].filter(Boolean).join(', ')}</span><small>{location.category || 'Цікаве місце'}</small></span>
        <span className="location-directory-card-arrow" aria-hidden="true">↗</span>
      </a>)}
    </div>
  </main>;
}
