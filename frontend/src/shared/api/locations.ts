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

  if (response.ok) return parseLocations(response);
  if (response.status < 500) {
    throw new Error(`API request failed (${response.status})`);
  }

  // The deployed backend currently errors while recording search history.
  // Its unfiltered location list is still available, so keep search usable.
  const allResponse = await apiRequest('/locations/', { signal });
  if (!allResponse.ok) throw new Error(`API request failed (${allResponse.status})`);
  const locations = await parseLocations(allResponse);
  const term = query.toLocaleLowerCase('uk');
  return locations.filter((location) =>
    [location.name, location.city, location.country, location.category]
      .some((value) => value?.toLocaleLowerCase('uk').includes(term)),
  );
}

async function parseLocations(response: Response): Promise<Location[]> {
  const results: unknown = await response.json();
  if (!Array.isArray(results)) {
    throw new Error('Unexpected locations response');
  }

  return results as Location[];
}
