import { GeoCache, GeoCacheItem } from '../../types';

const GEOCACHE_KEY = 'collect_geocache';

const sleep = (ms: number) => new Promise(res => setTimeout(res, ms));

export async function geocodeAddress(address: string): Promise<GeoCacheItem | null> {
  const key = address.trim();
  if (!key) return null;

  const geocache: GeoCache = JSON.parse(localStorage.getItem(GEOCACHE_KEY) || '{}');
  if (geocache[key]) return geocache[key];

  await sleep(500); // Respeitar limites da API pública
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(key)}&limit=1&addressdetails=0`;

  try {
    const res = await fetch(url, { headers: { 'Accept-Language': 'pt-BR' } });
    const data = await res.json();
    if (data && data.length > 0) {
      const item: GeoCacheItem = { lat: Number(data[0].lat), lng: Number(data[0].lon), display_name: data[0].display_name };
      geocache[key] = item;
      localStorage.setItem(GEOCACHE_KEY, JSON.stringify(geocache));
      return item;
    }
  } catch (e) {
    console.warn('Erro geocoding', e);
  }
  return null;
}