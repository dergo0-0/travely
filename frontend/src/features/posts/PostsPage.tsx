import { useEffect, useRef, useState, type FormEvent } from 'react';
import { getCityPosts, saveCityPost, type CityPost } from '../../shared/api/cityContent';
import './PostsPage.css';

type Props = { username: string | null };

export default function PostsPage({ username }: Props) {
  const [posts, setPosts] = useState<CityPost[]>([]);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'new'>('all');
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [city, setCity] = useState('');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setLoadError(false);
    void getCityPosts('', controller.signal)
      .then(setPosts)
      .catch((cause: unknown) => {
        if (cause instanceof Error && cause.name === 'AbortError') return;
        setLoadError(true);
      })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, []);

  const normalizedQuery = query.trim().toLocaleLowerCase('uk');
  const visiblePosts = posts.filter((post) => `${post.title} ${post.city} ${post.body}`.toLocaleLowerCase('uk').includes(normalizedQuery));
  const displayedPosts = filter === 'new' ? visiblePosts.filter((post) => Date.now() - new Date(post.created_at).getTime() < 30 * 24 * 60 * 60 * 1000) : visiblePosts;

  function openForm() {
    setSaveError('');
    setFormOpen(true);
    window.setTimeout(() => formRef.current?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' }), 20);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!city.trim() || !title.trim() || !body.trim()) return;
    setSaving(true);
    setSaveError('');
    try {
      const post = await saveCityPost(city.trim(), title.trim(), body.trim(), image);
      setPosts((current) => [post, ...current]);
      setFormOpen(false);
      window.location.hash = `#post?id=${post.id}&city=${encodeURIComponent(post.city)}`;
    } catch (cause) {
      setSaveError(cause instanceof Error ? cause.message : 'Не вдалося опублікувати пост. Спробуйте ще раз.');
    } finally { setSaving(false); }
  }

  return <main className="posts-page">
    <div className="posts-heading"><div><p className="eyebrow">ІСТОРІЇ МАНДРІВНИКІВ</p><h1>Пости</h1><p>Читайте історії про міста й діліться власними відкриттями.</p></div><button className="posts-create" type="button" onClick={username ? openForm : () => { window.location.hash = '#register'; }}>Написати пост <span aria-hidden="true">＋</span></button></div>
    <label className="posts-search"><span className="sr-only">Пошук постів</span><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Пошук за містом, назвою чи текстом" /></label>
    <div className="posts-filters" aria-label="Фільтр постів"><button type="button" className={filter === 'all' ? 'is-active' : ''} onClick={() => setFilter('all')}>Усе</button><button type="button" className={filter === 'new' ? 'is-active' : ''} onClick={() => setFilter('new')}>Нове за 30 днів</button></div>
    {formOpen && username && <form className="posts-form" ref={formRef} onSubmit={submit} aria-label="Створити пост">
      <div className="posts-form-heading"><div><p className="eyebrow">ВАША ІСТОРІЯ</p><h2>Новий пост</h2></div><button type="button" onClick={() => setFormOpen(false)} aria-label="Закрити форму">×</button></div>
      <div className="posts-form-fields"><label>Місто<input value={city} onChange={(event) => setCity(event.target.value)} required maxLength={120} placeholder="Наприклад, Львів" /></label><label>Назва поста<input value={title} onChange={(event) => setTitle(event.target.value)} required maxLength={200} placeholder="Що ви відкрили?" /></label></div>
      <label>Ваша історія<textarea value={body} onChange={(event) => setBody(event.target.value)} required rows={7} placeholder="Розкажіть, що робить це місце особливим" /></label>
      <label className="posts-image-picker"><input type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => setImage(event.target.files?.[0] ?? null)} /><span>{image ? 'Замінити фото' : 'Додати фото'}</span><small>{image?.name ?? 'JPG, PNG або WebP'}</small></label>
      {saveError && <p className="posts-error" role="alert">{saveError}</p>}
      <button className="posts-submit" type="submit" disabled={saving}>{saving ? 'Публікуємо…' : 'Опублікувати пост'}</button>
    </form>}
    <div className="posts-grid" aria-live="polite" aria-busy={loading}>
      {loading && <p className="posts-state">Завантажуємо пости…</p>}
      {loadError && <div className="posts-state" role="status"><p>Не вдалося завантажити пости.</p><button type="button" onClick={() => window.location.reload()}>Спробувати ще раз</button></div>}
      {!loading && !loadError && displayedPosts.length === 0 && <div className="posts-state"><p>{query || filter === 'new' ? 'За цими умовами постів немає.' : 'Пости ще не з’явилися. Напишіть першу історію.'}</p></div>}
      {!loading && !loadError && displayedPosts.map((post) => <a className="posts-card" href={`#post?id=${post.id}&city=${encodeURIComponent(post.city)}`} key={post.id}>
        {post.image ? <img src={post.image} alt="" /> : <span className="posts-card-placeholder" aria-hidden="true">{post.city.slice(0, 1).toLocaleUpperCase('uk')}</span>}
        <span className="posts-card-copy"><small>{post.city} · {new Intl.DateTimeFormat('uk-UA', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(post.created_at))}</small><strong>{post.title}</strong><span>{post.body}</span><em>Читати пост ↗</em></span>
      </a>)}
    </div>
  </main>;
}
