import { apiRequest } from './client';
import type { Location } from './locations';

export type LocationDetail = Omit<Location, 'latitude' | 'longitude'> & {
  latitude: number | null;
  longitude: number | null;
  submitted_by: string | null;
};

export type NewLocation = Pick<Location, 'name' | 'country' | 'city' | 'category' | 'address' | 'description'> & {
  latitude?: number;
  longitude?: number;
};

export async function getLocation(id: number, signal?: AbortSignal): Promise<LocationDetail> {
  const response = await apiRequest(`/locations/${id}/`, { signal });
  if (!response.ok) {
    throw new Error(response.status === 404
      ? 'Цю локацію не знайдено.'
      : 'Не вдалося завантажити локацію. Спробуйте ще раз.');
  }
  return response.json() as Promise<LocationDetail>;
}

export async function createLocation(location: NewLocation): Promise<LocationDetail> {
  const response = await apiRequest('/locations/', {
    method: 'POST',
    body: JSON.stringify(location),
  });
  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      throw new Error('Увійдіть у профіль, щоб додати локацію.');
    }
    const payload: unknown = await response.json().catch(() => null);
    if (payload && typeof payload === 'object') {
      const fields = payload as Record<string, unknown>;
      for (const key of ['name', 'country', 'city', 'latitude', 'longitude', 'category', 'address', 'description', 'non_field_errors', 'detail']) {
        const value = fields[key];
        const message = Array.isArray(value) ? value[0] : value;
        if (typeof message === 'string') throw new Error(message);
      }
    }
    throw new Error(response.status >= 500
      ? 'Сервер зараз недоступний. Спробуйте зберегти локацію пізніше.'
      : 'Не вдалося додати локацію. Перевірте поля та спробуйте ще раз.');
  }
  return response.json() as Promise<LocationDetail>;
}
