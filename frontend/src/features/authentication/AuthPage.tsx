import { useState, type FormEvent } from 'react';
import BrandLogo from '../../shared/ui/BrandLogo';
import { signIn, signOut, signUp } from '../../shared/api/client';
import './AuthPage.css';

type AuthMode = 'login' | 'register' | 'account';

type AuthPageProps = {
  mode: AuthMode;
  username: string | null;
  onSuccess: (username: string) => void;
  onSignOut: () => void;
};

export default function AuthPage({ mode, username, onSuccess, onSignOut }: AuthPageProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const isRegister = mode === 'register';

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formUsername = String(formData.get('username') ?? '').trim();
    const password = String(formData.get('password') ?? '');

    setIsLoading(true);
    setError('');
    try {
      if (isRegister) await signUp(formUsername, password);
      else await signIn(formUsername, password);
      onSuccess(formUsername);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Сталася помилка. Спробуйте ще раз.');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSignOut() {
    await signOut();
    onSignOut();
  }

  return (
    <main className="auth-page">
      <a className="auth-brand" href="#home" aria-label="TRAVELY — на головну">
        <BrandLogo className="brand-logo" />
      </a>
      <section className="auth-card" aria-labelledby="auth-title">
        {mode === 'account' && username ? (
          <>
            <p className="eyebrow">ОБЛІКОВИЙ ЗАПИС</p>
            <h1 id="auth-title">Вітаємо, {username}</h1>
            <p className="auth-description">Ви увійшли до свого облікового запису TRAVELY.</p>
            <button className="auth-submit" type="button" onClick={handleSignOut}>Вийти</button>
            <a className="auth-back-link" href="#home">Повернутися на головну</a>
          </>
        ) : (
          <>
            <p className="eyebrow">TRAVELY</p>
            <h1 id="auth-title">{isRegister ? 'Створити обліковий запис' : 'Увійти'}</h1>
            <p className="auth-description">
              {isRegister ? 'Зареєструйтеся, щоб зберігати свої відкриття.' : 'Увійдіть, щоб продовжити подорож.'}
            </p>
            <form className="auth-form" onSubmit={handleSubmit}>
              <label>
                Ім’я користувача
                <input name="username" autoComplete="username" required minLength={3} />
              </label>
              <label>
                Пароль
                <input
                  name="password"
                  type="password"
                  autoComplete={isRegister ? 'new-password' : 'current-password'}
                  required
                  minLength={isRegister ? 8 : 1}
                />
              </label>
              {error && <p className="auth-error" role="alert">{error}</p>}
              <button className="auth-submit" type="submit" disabled={isLoading}>
                {isLoading ? 'Зачекайте…' : isRegister ? 'Зареєструватися' : 'Увійти'}
              </button>
            </form>
            <p className="auth-switch">
              {isRegister ? 'Вже маєте акаунт?' : 'Ще не маєте акаунта?'}{' '}
              <a href={isRegister ? '#login' : '#register'}>{isRegister ? 'Увійти' : 'Зареєструватися'}</a>
            </p>
          </>
        )}
      </section>
      <a className="auth-back-link" href="#home">На головну</a>
    </main>
  );
}
