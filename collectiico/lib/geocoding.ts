// lib/geocoding.ts

// Definindo o tipo
export interface GeoData {
  lat: number;
  lng: number;
  display_name: string;
}

export async function geocodeAddress(address: string): Promise<GeoData | null> {
  const key = address.trim();
  if (!key) return null;

  // URL da API pública do OpenStreetMap (Nominatim)
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(key)}&limit=1&addressdetails=0`;

  try {
    const res = await fetch(url, {
      headers: {
        'Accept-Language': 'pt-BR',
        'User-Agent': 'CollectiicoApp/1.0 (seuemail@exemplo.com)' 
      }
    });

    if (!res.ok) {
        return null;
    }

    const data = await res.json();

    if (data && data.length > 0) {
      return {
        lat: Number(data[0].lat),
        lng: Number(data[0].lon),
        display_name: data[0].display_name
      };
    }
  } catch (e) {
    console.warn('Erro ao buscar coordenadas:', e);
  }
  return null;
}