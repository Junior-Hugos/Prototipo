"use client";

import { MapContainer, TileLayer, Marker, Popup, Polyline, CircleMarker, Tooltip, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L, { LatLngExpression } from 'leaflet';
import { useEffect } from 'react';

// Corrige o problema do ícone padrão do marcador no Leaflet com Webpack
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

useEffect(() => {
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
        iconRetinaUrl: iconRetinaUrl.src,
        iconUrl: iconUrl.src,
        shadowUrl: shadowUrl.src,
    });
}, []);


interface MapProps {
    center: LatLngExpression;
    zoom: number;
    markers: { lat: number, lng: number, popup: string }[];
    route?: LatLngExpression[];
}

// Componente para ajustar o mapa aos limites dos marcadores/rota
const MapBounds = ({ markers, route }: { markers: any[], route?: LatLngExpression[] }) => {
    const map = useMap();
    useEffect(() => {
        if (route && route.length > 0) {
            map.fitBounds(route as L.LatLngBoundsExpression, { padding: [40, 40] });
        } else if (markers.length > 0) {
            const bounds = L.latLngBounds(markers.map(m => [m.lat, m.lng]));
            map.fitBounds(bounds, { padding: [40, 40] });
        }
    }, [markers, route, map]);
    return null;
};


export default function Map({ center, zoom, markers, route }: MapProps) {
  if (typeof window === 'undefined') return null;

  return (
    <MapContainer center={center} zoom={zoom} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {markers.map((marker, idx) => (
        <Marker key={idx} position={[marker.lat, marker.lng]}>
          <Popup>{marker.popup}</Popup>
        </Marker>
      ))}

      {route && route.length > 0 && (
         <>
            <Polyline pathOptions={{ color: '#F59E0B', weight: 5, opacity: 0.8 }} positions={route} />
            {route.map((pos, idx) => (
                <CircleMarker key={idx} center={pos} radius={12} pathOptions={{ fillColor: '#92400e', color: '#fff', weight: 2 }}>
                    <Tooltip permanent direction="center" className="text-white font-bold">{idx + 1}</Tooltip>
                </CircleMarker>
            ))}
        </>
      )}
      <MapBounds markers={markers} route={route} />
    </MapContainer>
  );
}