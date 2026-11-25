import { useEffect, useState } from 'react';
import { getCityPost, type CityPost } from '../../shared/api/cityContent';
import './PostPage.css';

type Props = { id: number; city: string; username: string | null };

export default function PostPage({ id, city, username }: Props) {
  const [post, setPost] = useState<CityPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(false);
    setPost(null);
    void getCityPost(id, controller.signal)
      .then(setPost)
      .catch((cause: unknown) => { if (!(cause instanceof Error && cause.name === 'AbortError')) setError(true); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [id]);

  const backHref = `#collection?city=${encodeURIComponent(post?.city || city || 'Токіо')}`;
  return <main className="post-page">
    <nav className="post-breadcrumb" aria-label="Шлях сторінки"><a href="#home">Головна</a><span>›</span><a href={backHref}>{post?.city || city || 'Підбірка'}</a><span>›</span><span>{post?.title || 'Пост'}</span></nav>
    {loading && <p className="post-page-state">Завантажуємо пост…</p>}
    {error && <div className="post-page-state"><p>Не вдалося відкрити пост.</p><a href={backHref}>Повернутися до підбірки</a></div>}
    {post && <article>
      <header className={`post-hero${post.image ? '' : ' no-image'}`}>
        {post.image && <img src={post.image} alt="" />}
        <h1>{post.title}</h1>
      </header>
      <div className="post-byline"><span className="post-avatar" aria-hidden="true">{post.author.slice(0, 1).toLocaleUpperCase('uk')}</span><div><strong>{post.author}</strong><span>{new Intl.DateTimeFormat('uk-UA', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(post.created_at))} · {post.city}</span></div></div>
      <div className="post-body">{post.body.split(/\n\n+/).map((paragraph, index) => <p key={index}>{paragraph}</p>)}</div>
      <footer className="post-footer"><a href={backHref}>← Повернутися до підбірки</a>{username === post.author && <a href={backHref}>Мої пости та редагування</a>}</footer>
    </article>}
  </main>;
}
