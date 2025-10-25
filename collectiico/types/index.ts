export interface User {
  id: number;
  tipo: 'doador' | 'voluntario' | 'cooperativa';
  nome: string;
  email: string;
  telefone: string;
  endereco: string;
}

export interface Coleta {
  id: number;
  nome: string;
  email: string;
  endereco: string;
  materiais: string[];
  status: 'agendada' | 'coletada' | 'cancelada';
  lat?: number;
  lng?: number;
  geolocalizado: boolean;
  localDisplay?: string;
}

export interface Campanha {
  id: number;
  titulo: string;
  desc: string;
}

export interface GeoCache {
    [key: string]: GeoCacheItem;
}

export interface GeoCacheItem {
    lat: number;
    lng: number;
    display_name: string;
}