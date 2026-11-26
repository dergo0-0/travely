import { useEffect, useState, type FormEvent } from 'react';
import Icon from '../../shared/ui/Icon';
import { createLocation, getLocation, type LocationDetail } from '../../shared/api/locationDetails';
import './LocationPage.css';

type Props = { id?: number; username: string | null };

const emptyForm = {
  name: '', country: '', city: '', category: '', address: '', description: '', latitude: '', longitude: '',
};

export default function LocationPage({ id, username }: Props) {
  const [location, setLocation] = useState<LocationDetail | null>(null);
  const [loading, setLoading] = useState(Boolean(id));
  const [loadError, setLoadError] = useState('');
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  useEffect(() => {
    if (!id) return;
    const controller = new AbortController();
    setLoading(true);
    setLocation(null);
    setLoadError('');
    void getLocation(id, controller.signal)
      .then(setLocation)
      .catch((cause: unknown) => {
        if (!(cause instanceof Error && cause.name === 'AbortError')) {
          setLoadError(cause instanceof Error ? cause.message : 'Не вдалося відкрити локацію.');
        }
      })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [id]);

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (saving) return;
    setSaving(true);
    setSaveError('');
    try {
      const latitude = form.latitude.trim();
      const longitude = form.longitude.trim();
      if (Boolean(latitude) !== Boolean(longitude)) {
        throw new Error('Вкажіть обидві координати або залиште обидва поля порожніми.');
      }
      const created = await createLocation({
        name: form.name.trim(),
        country: form.country.trim(),
        city: form.city.trim(),
        category: form.category.trim(),
        address: form.address.trim(),
        description: form.description.trim(),
        ...(latitude && longitude ? { latitude: Number(latitude), longitude: Number(longitude) } : {}),
      });
      window.location.hash = `#location?id=${created.id}`;
    } catch (cause) {
      setSaveError(cause instanceof Error ? cause.message : 'Не вдалося додати локацію.');
    } finally {
      setSaving(false);
    }
  }

  const backHref = location?.city
    ? `#collection?city=${encodeURIComponent(location.city)}`
    : '#locations';

  if (!id) {
    return <main className="location-page">
      <nav className="location-breadcrumb" aria-label="Шлях сторінки"><a href="#home">Головна</a><span>›</span><a href="#locations">Локації</a><span>›</span><span>Додати локацію</span></nav>
      <div className="location-create-heading"><span className="eyebrow">ПОДІЛІТЬСЯ ЗНАХІДКОЮ</span><h1>Додати локацію</h1><p>Розкажіть іншим мандрівникам про місце, яке варто відвідати.</p></div>
      {!username ? <section className="location-auth-prompt"><Icon name="location" /><h2>Увійдіть, щоб додати місце</h2><p>Після реєстрації ви зможете додавати свої локації та ділитися порадами.</p><a className="location-primary-button" href="#register">Зареєструватися</a><a className="location-text-link" href="#login">У мене вже є профіль</a></section> :
        <form className="location-create-form" onSubmit={handleCreate}>
          <div className="location-form-grid">
            <label>Назва місця <span aria-hidden="true">*</span><input autoComplete="off" maxLength={100} required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Наприклад, Софійський собор" /></label>
            <label>Країна <span aria-hidden="true">*</span><input autoComplete="country-name" maxLength={100} required value={form.country} onChange={(event) => setForm({ ...form, country: event.target.value })} placeholder="Україна" /></label>
            <label>Місто <span aria-hidden="true">*</span><input autoComplete="address-level2" maxLength={100} required value={form.city} onChange={(event) => setForm({ ...form, city: event.target.value })} placeholder="Київ" /></label>
            <label>Категорія<input maxLength={100} value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} placeholder="Пам’ятка, парк, музей…" /></label>
            <label className="location-form-wide">Адреса<input autoComplete="street-address" maxLength={200} value={form.address} onChange={(event) => setForm({ ...form, address: event.target.value })} placeholder="Вулиця й номер будинку (необов’язково)" /></label>
            <label className="location-form-wide">Чим цікаве це місце?<textarea rows={5} value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} placeholder="Поділіться враженням або порадою для відвідувачів" /></label>
          </div>
          <details className="location-coordinate-fields"><summary>Додати координати <span>необов’язково</span></summary><p>Якщо знаєте точне розташування, вкажіть широту й довготу разом.</p><div className="location-form-grid"><label>Широта<input type="number" inputMode="decimal" min={-90} max={90} step="any" value={form.latitude} onChange={(event) => setForm({ ...form, latitude: event.target.value })} placeholder="50.4501" /></label><label>Довгота<input type="number" inputMode="decimal" min={-180} max={180} step="any" value={form.longitude} onChange={(event) => setForm({ ...form, longitude: event.target.value })} placeholder="30.5234" /></label></div></details>
          {saveError && <p className="location-form-error" role="alert">{saveError}</p>}
          <div className="location-form-actions"><button className="location-primary-button" type="submit" disabled={saving}>{saving ? 'Додаємо…' : 'Додати локацію'}</button><a className="location-text-link" href="#locations">Скасувати</a></div>
        </form>}
    </main>;
  }

  return <main className="location-page">
    <nav className="location-breadcrumb" aria-label="Шлях сторінки"><a href="#home">Головна</a><span>›</span><a href="#locations">Локації</a><span>›</span><span>{location?.name || 'Локація'}</span></nav>
    {loading && <div className="location-page-state" role="status">Відкриваємо локацію…</div>}
    {!loading && loadError && <div className="location-page-state" role="alert"><p>{loadError}</p><a href="#locations">Переглянути всі локації</a></div>}
    {!loading && location && <article className="location-detail">
      <header className="location-detail-hero"><div className="location-detail-mark" aria-hidden="true"><Icon name="location" /></div><div><span className="eyebrow">ЛОКАЦІЯ МАНДРІВНИКІВ</span><h1>{location.name}</h1><p>{[location.city, location.country].filter(Boolean).join(', ')}</p></div></header>
      <div className="location-detail-layout"><div className="location-detail-story"><span className="eyebrow">ПРО МІСЦЕ</span><h2>Варто побачити</h2>{location.description ? location.description.split(/\n\n+/).map((paragraph, index) => <p key={index}>{paragraph}</p>) : <p>Автор поки не додав опис. Можливо, це місце надихне вас на власну історію.</p>}</div><aside className="location-detail-facts" aria-label="Інформація про місце"><h2>Про локацію</h2>{location.category && <div><span>Категорія</span><strong>{location.category}</strong></div>}{location.address && <div><span>Адреса</span><strong>{location.address}</strong></div>}<div><span>Місто та країна</span><strong>{[location.city, location.country].filter(Boolean).join(', ')}</strong></div>{location.submitted_by && <div><span>Додав(-ла)</span><strong>{location.submitted_by}</strong></div>}{location.latitude != null && location.longitude != null && <a className="location-map-link" href={`https://www.openstreetmap.org/?mlat=${location.latitude}&mlon=${location.longitude}#map=15/${location.latitude}/${location.longitude}`} target="_blank" rel="noopener noreferrer">Показати на мапі <Icon name="arrow-up-right" /></a>}</aside></div>
      <footer className="location-detail-footer"><a href={backHref}>← Повернутися до підбірки</a><a href="#locations">Усі локації</a></footer>
    </article>}
  </main>;
}
