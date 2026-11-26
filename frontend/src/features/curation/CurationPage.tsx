import { useEffect, useRef, useState, type FormEvent } from 'react';
import Icon from '../../shared/ui/Icon';
import { searchLocations, type Location } from '../../shared/api/locations';
import { getCityCovers, getCityPosts, saveCityCover, saveCityPost, type CityCover, type CityPost } from '../../shared/api/cityContent';
import tokyoHero from './assets/tokyo-hero.png';
import tokyoMuseum from './assets/tokyo-museum.png';
import sensojiTemple from './assets/sensoji-temple.png';
import osakaCastle from './assets/osaka-castle.png';
import meijiShrine from './assets/meiji-shrine.png';
import './CurationPage.css';

type Props = { query: string; username: string | null };

const featuredPlaces = [
  { name: 'Токійський національний музей', image: tokyoMuseum, rating: '4,5', reviews: '426' },
  { name: 'Буддійський храм Сенсо-дзі', image: sensojiTemple, rating: '4,6', reviews: '510' },
  { name: 'Замок Осака', image: osakaCastle, rating: '4,4', reviews: '389' },
  { name: 'Храм Мейдзі', image: meijiShrine, rating: '4,7', reviews: '692' },
];

export default function CurationPage({ query, username }: Props) {
  const destination = query || 'Токіо';
  const isTokyo = /^(токіо|токио|tokyo)$/i.test(destination);
  const [input, setInput] = useState(destination);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [category, setCategory] = useState('');
  const [cover, setCover] = useState<CityCover | null>(null);
  const [posts, setPosts] = useState<CityPost[]>([]);
  const [postSearch, setPostSearch] = useState('');
  const [contentLoading, setContentLoading] = useState(true);
  const [contentError, setContentError] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<number | null>(null);
  const [postTitle, setPostTitle] = useState('');
  const [postBody, setPostBody] = useState('');
  const [postImage, setPostImage] = useState<File | null>(null);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const postFormRef = useRef<HTMLFormElement>(null);

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

  useEffect(() => {
    const controller = new AbortController();
    setContentLoading(true);
    setContentError(false);
    setCover(null);
    setPosts([]);
    setPostSearch('');
    setFormOpen(false);
    setEditingPost(null);
    setSaveError('');
    void Promise.all([getCityCovers(destination, controller.signal), getCityPosts(destination, controller.signal)])
      .then(([covers, cityPosts]) => { setCover(covers[0] ?? null); setPosts(cityPosts); })
      .catch((cause: unknown) => {
        if (cause instanceof Error && cause.name === 'AbortError') return;
        setContentError(true);
      })
      .finally(() => { if (!controller.signal.aborted) setContentLoading(false); });
    return () => controller.abort();
  }, [destination]);

  const categories = [...new Set(locations.map((location) => location.category).filter(Boolean))];
  const visibleLocations = category ? locations.filter((location) => location.category === category) : locations;
  const visiblePosts = posts.filter((post) => `${post.title} ${post.body}`.toLocaleLowerCase('uk').includes(postSearch.trim().toLocaleLowerCase('uk')));

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

  function startPost(post?: CityPost) {
    setEditingPost(post?.id ?? null);
    setPostTitle(post?.title ?? '');
    setPostBody(post?.body ?? '');
    setPostImage(null);
    setSaveError('');
    setFormOpen(true);
    window.setTimeout(() => postFormRef.current?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'center' }), 50);
  }

  async function handlePostSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setSaveError('');
    try {
      const saved = await saveCityPost(destination, postTitle.trim(), postBody.trim(), postImage, editingPost ?? undefined);
      setPosts((current) => editingPost ? current.map((post) => post.id === saved.id ? saved : post) : [saved, ...current]);
      setFormOpen(false);
      setEditingPost(null);
    } catch (cause) {
      setSaveError(cause instanceof Error ? cause.message : 'Не вдалося зберегти допис.');
    } finally { setSaving(false); }
  }

  async function handleCoverSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!coverImage) return;
    setSaving(true);
    setSaveError('');
    try {
      setCover(await saveCityCover(destination, coverImage, cover?.uploaded_by === username ? cover.id : undefined));
      setCoverImage(null);
    } catch (cause) {
      setSaveError(cause instanceof Error ? cause.message : 'Не вдалося зберегти фото.');
    } finally { setSaving(false); }
  }

  return (
    <main className="curation-page">
      <section className={`curation-hero${isTokyo ? ' is-tokyo' : ''}`} aria-labelledby="curation-title">
        {(cover || isTokyo) && <img className="curation-hero-image" src={cover?.image || tokyoHero} alt={cover ? `Головне фото міста ${destination}` : 'Пагода, цвітіння сакури та гора Фудзі'} />}
        <h1 id="curation-title">{isTokyo ? 'TOKYO' : destination.toLocaleUpperCase('uk')}</h1>
        <form className="curation-hero-fields" onSubmit={handleSearch} aria-label="Параметри подорожі">
          <label className="curation-field">
            <Icon name="location" />
            <input value={input} onChange={(event) => setInput(event.target.value)} placeholder="Місто або місце" aria-label="Місто або місце" required />
          </label>
          <label className="curation-field">
            <Icon name="calendar" />
            <input placeholder="Дата (незабаром)" aria-label="Дата — незабаром" disabled readOnly />
          </label>
          <label className="curation-field">
            <Icon name="users" />
            <input placeholder="Мандрівники (незабаром)" aria-label="Мандрівники — незабаром" disabled readOnly />
          </label>
          <button className="curation-search-button" type="submit">Пошук</button>
        </form>
      </section>

      <section className="curation-results" id="collection-results" aria-labelledby="curation-results-title">
        <div className="curation-controls">
          <p>Відкрийте місця та історії мандрівників</p>
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

        <div className="curation-section-heading">
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
        </div>

        <section className="curation-posts" aria-labelledby="curation-posts-title">
          <div className="curation-section-heading">
            <div><p className="eyebrow">ІСТОРІЇ МАНДРІВНИКІВ</p><h2 id="curation-posts-title">Пости про місто «{destination}»</h2></div>
            {username && <button className="curation-primary-button" type="button" onClick={() => startPost()}>Написати пост</button>}
          </div>
          {!contentLoading && !contentError && posts.length > 0 && <label className="curation-post-search"><Icon name="location" /><input value={postSearch} onChange={(event) => setPostSearch(event.target.value)} placeholder="Пошук серед постів" aria-label="Пошук серед постів" /></label>}
          {contentLoading && <p className="curation-state">Завантажуємо історії…</p>}
          {contentError && <div className="curation-empty-city" role="status"><Icon name="map" /><h3>Розкажіть про своє місто</h3><p>Зараз не вдалося перевірити пости й фото для «{destination}». Коли сервіс відновиться, зареєстровані мандрівники зможуть додавати історії та головне фото.</p>{!username && <a className="curation-primary-button" href="#register">Зареєструватися</a>}</div>}
          {!contentLoading && !contentError && posts.length > 0 && visiblePosts.length === 0 && <p className="curation-state">За цим запитом постів немає. Спробуйте інші слова.</p>}
          {!contentLoading && !contentError && visiblePosts.length > 0 && <div className="curation-post-grid">
            {visiblePosts.map((post) => <article className="curation-post-card" key={post.id}>
              {post.image && <img src={post.image} alt="" />}
              <div className="curation-post-copy">
                <span className="curation-post-meta">{post.author} · {new Intl.DateTimeFormat('uk-UA', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(post.created_at))}</span>
                <h3><a href={`#post?id=${post.id}&city=${encodeURIComponent(destination)}`}>{post.title}</a></h3><p>{post.body}</p>
                {post.author === username && <button type="button" className="curation-text-button" onClick={() => startPost(post)}>Редагувати</button>}
              </div>
            </article>)}
          </div>}
          {!contentLoading && !contentError && posts.length === 0 && !cover && !isTokyo && <div className="curation-empty-city" role="status">
            <Icon name="map" />
            <h3>Покажіть своє місто світові</h3>
            <p>Для «{destination}» поки немає постів і головного фото. Зареєструйтеся, щоб додати фото та розповісти про місця, які варто відвідати.</p>
            {username ? <button className="curation-primary-button" type="button" onClick={() => startPost()}>Додати перший пост</button> : <a className="curation-primary-button" href="#register">Зареєструватися</a>}
          </div>}
          {!contentLoading && !contentError && posts.length === 0 && (cover || isTokyo) && <div className="curation-empty-city" role="status"><h3>Історії ще попереду</h3><p>Поки що немає постів про «{destination}». {username ? 'Розкажіть про нього першим.' : 'Зареєструйтеся, щоб поділитися своєю історією.'}</p>{username ? <button className="curation-primary-button" type="button" onClick={() => startPost()}>Написати пост</button> : <a className="curation-primary-button" href="#register">Зареєструватися</a>}</div>}
          {username && !contentLoading && !contentError && (!cover || cover.uploaded_by === username) && <form className="curation-cover-form" onSubmit={handleCoverSave}>
            <div><h3>{cover ? 'Оновити головне фото' : 'Додати головне фото міста'}</h3><p>Фото з’явиться на обкладинці підбірки для «{destination}».</p></div>
            <label className="curation-file-picker">
              <input type="file" accept="image/jpeg,image/png,image/webp" aria-label="Головне фото міста" onChange={(event) => setCoverImage(event.target.files?.[0] ?? null)} required />
              <span>Обрати фото</span>
            </label>
            <span className="curation-file-name" title={coverImage?.name}>{coverImage?.name || 'Файл не обрано'}</span>
            <button className="curation-primary-button" type="submit" disabled={!coverImage || saving}>Зберегти фото</button>
          </form>}
          {username && formOpen && <form className="curation-post-form" ref={postFormRef} onSubmit={handlePostSave}>
            <h3>{editingPost ? 'Редагувати пост' : `Новий пост про ${destination}`}</h3>
            <label>Назва поста<input value={postTitle} onChange={(event) => setPostTitle(event.target.value)} maxLength={160} required /></label>
            <label>Ваша історія<textarea value={postBody} onChange={(event) => setPostBody(event.target.value)} rows={6} required /></label>
            <label>Фото (необов’язково)<span className="curation-file-picker"><input type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => setPostImage(event.target.files?.[0] ?? null)} /><span>Обрати фото</span></span><span className="curation-file-name" title={postImage?.name}>{postImage?.name || 'Файл не обрано'}</span></label>
            <div className="curation-form-actions"><button className="curation-primary-button" type="submit" disabled={saving}>{saving ? 'Зберігаємо…' : 'Зберегти пост'}</button><button className="curation-text-button" type="button" onClick={() => setFormOpen(false)}>Скасувати</button></div>
          </form>}
          {saveError && <p className="curation-form-error" role="alert">{saveError}</p>}
        </section>
      </section>
    </main>
  );
}
