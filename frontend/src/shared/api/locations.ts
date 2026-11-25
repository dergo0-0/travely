import { apiRequest } from './client';

export type Location = {
  id: number;
  name: string;
  country: string;
  city: string;
  category: string;
  address: string;
  description: string;
  latitude: number;
  longitude: number;
};

export async function searchLocations(query: string, signal?: AbortSignal) {
  const params = new URLSearchParams({ search: query });
  const response = await apiRequest(`/locations/?${params}`, { signal });
  if (!response.ok) throw new Error(`API request failed (${response.status})`);
  return parseLocations(response);
}

async function parseLocations(response: Response): Promise<Location[]> {
  const results: unknown = await response.json();
  if (!Array.isArray(results)) {
    throw new Error('Unexpected locations response');
  }

  return results as Location[];
}
