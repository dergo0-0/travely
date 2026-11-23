const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/$/, '');
const accessKey = 'travely.access';
const refreshKey = 'travely.refresh';
const usernameKey = 'travely.username';

type TokenPair = { access: string; refresh: string };

export function getSessionUsername() {
  return sessionStorage.getItem(usernameKey);
}

export async function apiRequest(path: string, init: RequestInit = {}) {
  const makeRequest = (accessToken: string | null) => {
    const headers = new Headers(init.headers);
    if (accessToken) headers.set('Authorization', `Bearer ${accessToken}`);
    if (init.body && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json');

    return fetch(`${apiBaseUrl}${path}`, { ...init, headers });
  };

  const response = await makeRequest(sessionStorage.getItem(accessKey));
  if (response.status !== 401 || path.startsWith('/token/')) return response;

  const refreshToken = sessionStorage.getItem(refreshKey);
  if (!refreshToken) return response;

  const refreshResponse = await fetch(`${apiBaseUrl}/token/refresh/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh: refreshToken }),
  });

  if (!refreshResponse.ok) {
    clearSession();
    return response;
  }

  const tokens = (await refreshResponse.json()) as { access: string; refresh?: string };
  sessionStorage.setItem(accessKey, tokens.access);
  if (tokens.refresh) sessionStorage.setItem(refreshKey, tokens.refresh);
  return makeRequest(tokens.access);
}

export async function signIn(username: string, password: string) {
  const response = await fetch(`${apiBaseUrl}/token/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.detail || 'Не вдалося увійти. Перевірте ім’я користувача та пароль.');
  }

  const tokens = (await response.json()) as TokenPair;
  sessionStorage.setItem(accessKey, tokens.access);
  sessionStorage.setItem(refreshKey, tokens.refresh);
  sessionStorage.setItem(usernameKey, username);
}

export async function signUp(username: string, password: string) {
  const response = await apiRequest('/register/', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    const detail = payload.username?.[0] || payload.password?.[0] || payload.detail;
    throw new Error(detail || 'Не вдалося створити обліковий запис.');
  }

  await signIn(username, password);
}

export async function signOut() {
  const refresh = sessionStorage.getItem(refreshKey);
  if (refresh) {
    await apiRequest('/token/blacklist/', {
      method: 'POST',
      body: JSON.stringify({ refresh }),
    }).catch(() => undefined);
  }
  clearSession();
}

function clearSession() {
  sessionStorage.removeItem(accessKey);
  sessionStorage.removeItem(refreshKey);
  sessionStorage.removeItem(usernameKey);
}
