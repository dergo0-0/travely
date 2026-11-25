import { apiRequest } from './client';

export type CityCover = { id: number; city: string; image: string; uploaded_by: string; updated_at: string };
export type CityPost = { id: number; city: string; title: string; body: string; image: string | null; author: string; created_at: string; updated_at: string };

async function readList<T>(path: string, signal?: AbortSignal): Promise<T[]> {
  const response = await apiRequest(path, { signal });
  if (!response.ok) throw new Error(`API request failed (${response.status})`);
  const payload: unknown = await response.json();
  if (Array.isArray(payload)) return payload as T[];
  if (typeof payload === 'object' && payload !== null && 'results' in payload && Array.isArray(payload.results)) return payload.results as T[];
  throw new Error('Unexpected response');
}

export function getCityCovers(city: string, signal?: AbortSignal) {
  return readList<CityCover>(`/city-covers/?city=${encodeURIComponent(city)}`, signal);
}

export function getCityPosts(city: string, signal?: AbortSignal) {
  return readList<CityPost>(`/city-posts/?city=${encodeURIComponent(city)}`, signal);
}

export async function getCityPost(id: number, signal?: AbortSignal): Promise<CityPost> {
  const response = await apiRequest(`/city-posts/${id}/`, { signal });
  if (!response.ok) throw new Error(`API request failed (${response.status})`);
  return response.json() as Promise<CityPost>;
}

async function submit<T>(path: string, method: 'POST' | 'PATCH', form: FormData): Promise<T> {
  const response = await apiRequest(path, { method, body: form });
  if (!response.ok) {
    if (response.status === 401 || response.status === 403) throw new Error('Увійдіть у профіль, щоб зберегти зміни.');
    throw new Error('Не вдалося зберегти. Перевірте поля та спробуйте ще раз.');
  }
  return response.json() as Promise<T>;
}

export function saveCityCover(city: string, image: File, existingId?: number) {
  const form = new FormData();
  form.set('city', city);
  form.set('image', image);
  return submit<CityCover>(existingId ? `/city-covers/${existingId}/` : '/city-covers/', existingId ? 'PATCH' : 'POST', form);
}

export function saveCityPost(city: string, title: string, body: string, image?: File | null, existingId?: number) {
  const form = new FormData();
  form.set('city', city);
  form.set('title', title);
  form.set('body', body);
  if (image) form.set('image', image);
  return submit<CityPost>(existingId ? `/city-posts/${existingId}/` : '/city-posts/', existingId ? 'PATCH' : 'POST', form);
}
