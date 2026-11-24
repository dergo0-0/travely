import { useEffect, useRef, useState, type FormEvent } from 'react';
import { signIn, signOut, signUp } from '../../shared/api/client';
import './AuthPage.css';

type AuthMode = 'login' | 'register' | 'account';
type Props = { open: boolean; mode: AuthMode; username: string | null; onClose: () => void; onSuccess: (username: string) => void; onSignOut: () => void };

function PasswordField({ name, placeholder, autoComplete }: { name: string; placeholder: string; autoComplete: string }) {
  const [visible, setVisible] = useState(false);
  return <label className="auth-input-wrap">
    <span className="sr-only">{placeholder}</span>
    <input name={name} placeholder={placeholder} type={visible ? 'text' : 'password'} autoComplete={autoComplete} required />
    <button className="password-toggle" type="button" aria-label={visible ? 'Приховати пароль' : 'Показати пароль'} aria-pressed={visible} onClick={() => setVisible(!visible)}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>{visible && <path d="m3 3 18 18"/>}</svg>
    </button>
  </label>;
}

export default function AuthPage({ open, mode, username, onClose, onSuccess, onSignOut }: Props) {
  const dialogRef = useRef<HTMLElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const isRegister = mode === 'register';
  useEffect(() => { setError(''); }, [mode]);
  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    document.body.style.overflow = 'hidden';
    const focusFrame = requestAnimationFrame(() => (dialogRef.current?.querySelector<HTMLElement>('input') ?? dialogRef.current?.querySelector<HTMLElement>('.auth-close'))?.focus());
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose();
      if (event.key !== 'Tab' || !dialogRef.current) return;
      const controls = Array.from(dialogRef.current.querySelectorAll<HTMLElement>('a[href], button:not(:disabled), input:not(:disabled)'));
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      cancelAnimationFrame(focusFrame);
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
      previousFocus?.focus();
    };
  }, [open, onClose]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const login = String(data.get('username') ?? '').trim();
    const password = String(data.get('password') ?? '');
    if (isRegister && password !== data.get('confirmation')) {
      setError('Паролі не збігаються. Перевірте підтвердження пароля.');
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      if (isRegister) await signUp(login, password);
      else await signIn(login, password);
      onSuccess(login);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Сталася помилка. Спробуйте ще раз.');
    } finally { setIsLoading(false); }
  }

  return <div className="auth-page" data-open={open} aria-hidden={!open} inert={!open} onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <section ref={dialogRef} className={`auth-card${isRegister ? ' auth-card-register' : ''}`} role="dialog" aria-modal="true" aria-label={mode === 'account' ? 'Профіль' : isRegister ? 'Реєстрація' : 'Вхід'}>
      <button className="auth-close" type="button" aria-label="Закрити вікно" onClick={onClose}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true"><path d="M5 5 19 19M19 5 5 19" /></svg></button>
      {mode === 'account' && username ? <div className="auth-account">
        <h1>Вітаємо, {username}</h1>
        <button className="auth-submit" onClick={async () => { await signOut(); onSignOut(); }}>Вийти</button>
        <a href="#home">На головну</a>
      </div> : <>
        <nav className="auth-tabs" aria-label="Авторизація">
          <a href="#login" aria-current={!isRegister ? 'page' : undefined}>Увійти</a>
          <a href="#register" aria-current={isRegister ? 'page' : undefined}>Зареєструватися</a>
        </nav>
        <h1 className="sr-only">{isRegister ? 'Реєстрація' : 'Увійти'}</h1>
        <form className="auth-form" onSubmit={handleSubmit} key={mode}>
          <label className="auth-input-wrap">
            <span className="sr-only">Електронна пошта або ім’я користувача</span>
            <input name="username" placeholder="Електронна пошта" autoComplete="username" autoCapitalize="none" spellCheck={false} required />
          </label>
          <PasswordField name="password" placeholder="Пароль" autoComplete={isRegister ? 'new-password' : 'current-password'} />
          {isRegister ? <PasswordField name="confirmation" placeholder="Підтвердити пароль" autoComplete="new-password" /> :
            <button className="auth-forgot" type="button" onClick={() => setError('Відновлення пароля ще не підключене. Зверніться до адміністратора сайту.')}>Забули пароль?</button>}
          {error && <p className="auth-error" role="alert">{error}</p>}
          <button className="auth-submit" type="submit" disabled={isLoading}>{isLoading ? 'Зачекайте…' : isRegister ? 'Зареєструватися' : 'Увійти'}</button>
        </form>
      </>}
    </section>
  </div>;
}
