'use client';

import { useState } from 'react';
import { MapPin, Loader2 } from 'lucide-react';

interface CoordenadesExtractorProps {
  onCoordenadesTrobades: (lat: number, lng: number, direccio: string) => void;
}

export default function CoordenadesExtractor({ onCoordenadesTrobades }: CoordenadesExtractorProps) {
  const [url, setUrl] = useState('');
  const [carregant, setCarregant] = useState(false);
  const [error, setError] = useState('');

  function extreureCoordenadesDeUrl(url: string): { lat: number; lng: number } | null {
    // Patró 1: google.com/maps?q=lat,lng
    const qMatch = url.match(/[?&]q=(-?\d+\.?\d*),(-?\d+\.?\d*)/);
    if (qMatch) {
      return { lat: parseFloat(qMatch[1]), lng: parseFloat(qMatch[2]) };
    }

    // Patró 2: google.com/maps/@lat,lng,zoom
    const atMatch = url.match(/@(-?\d+\.?\d*),(-?\d+\.?\d*)/);
    if (atMatch) {
      return { lat: parseFloat(atMatch[1]), lng: parseFloat(atMatch[2]) };
    }

    // Patró 3: google.com/maps/place/.../@lat,lng
    const placeMatch = url.match(/@(-?\d+\.?\d*),(-?\d+\.?\d*)/);
    if (placeMatch) {
      return { lat: parseFloat(placeMatch[1]), lng: parseFloat(placeMatch[2]) };
    }

    // Patró 4: Short URL (maps.app.goo.gl) - no es poden extreure directament
    if (url.includes('maps.app.goo.gl')) {
      throw new Error('Els enllaços curts de Google Maps no es poden processar directament. Obre l\'enllaç i copia la URL completa.');
    }

    return null;
  }

  async function processarUrl() {
    setError('');
    setCarregant(true);

    try {
      if (!url.includes('google.com/maps') && !url.includes('maps.app.goo.gl')) {
        throw new Error('URL no vàlida. Ha de ser un enllaç de Google Maps.');
      }

      const coordenades = extreureCoordenadesDeUrl(url);
      
      if (!coordenades) {
        throw new Error('No s\'han pogut extreure les coordenades. Prova d\'obrir l\'enllaç i copiar la URL completa des de la barra d\'adreces.');
      }

      // Validar rang de coordenades (Catalunya aprox)
      if (coordenades.lat < 40 || coordenades.lat > 43 || coordenades.lng < 0 || coordenades.lng > 4) {
        console.warn('Coordenades fora de Catalunya:', coordenades);
      }

      // Obtenir direcció aproximada amb geocodificació inversa (OpenStreetMap - gratuït)
      let direccio = '';
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coordenades.lat}&lon=${coordenades.lng}&accept-language=ca`
        );
        const data = await response.json();
        direccio = data.display_name || '';
      } catch (e) {
        console.log('No s\'ha pogut obtenir la direcció');
      }

      onCoordenadesTrobades(coordenades.lat, coordenades.lng, direccio);
      setUrl('');
      
    } catch (err: any) {
      setError(err.message || 'Error processant l\'URL');
    } finally {
      setCarregant(false);
    }
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
      <div className="flex items-center gap-2 mb-2">
        <MapPin className="w-5 h-5 text-blue-600" />
        <h3 className="font-semibold text-blue-900">Extreure coordenades de Google Maps</h3>
      </div>
      
      <p className="text-sm text-blue-700 mb-3">
        Enganxa l\'enllaç de Google Maps i extreu automàticament les coordenades
      </p>

      <div className="flex gap-2">
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://www.google.com/maps/place/..."
          className="input-field flex-1"
        />
        <button
          type="button"
          onClick={processarUrl}
          disabled={carregant || !url}
          className="btn-secondary flex items-center gap-2 disabled:opacity-50"
        >
          {carregant ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <MapPin className="w-4 h-4" />
          )}
          Extreure
        </button>
      </div>

      {error && (
        <p className="text-red-600 text-sm mt-2">{error}</p>
      )}

      <p className="text-xs text-blue-600 mt-2">
        💡 Consell: Obre Google Maps, cerca el restaurant, clica "Compartir" → "Copiar enllaç"
      </p>
    </div>
  );
}
