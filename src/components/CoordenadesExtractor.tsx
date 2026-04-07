'use client';

import { useState } from 'react';
import { MapPin, Loader2, ExternalLink } from 'lucide-react';

interface CoordenadesExtractorProps {
  onCoordenadesTrobades: (lat: number, lng: number, direccio: string) => void;
}

export default function CoordenadesExtractor({ onCoordenadesTrobades }: CoordenadesExtractorProps) {
  const [url, setUrl] = useState('');
  const [carregant, setCarregant] = useState(false);
  const [error, setError] = useState('');
  const [urlExpandida, setUrlExpandida] = useState('');

  async function expandirUrlCurta(urlCurta: string): Promise<string | null> {
    try {
      // Si ja és una URL llarga, retornar-la directament
      if (urlCurta.includes('google.com/maps')) {
        return urlCurta;
      }

      // Si és un enllaç curt de Google Maps, intentar expandir-lo
      if (urlCurta.includes('maps.app.goo.gl') || urlCurta.includes('goo.gl')) {
        // Fem una petició HEAD per seguir les redireccions
        // Nota: En client-side, els CORS poden bloquejar això
        // Per això usem un servei de tercers o intentem obrir en nova finestra
        
        // Opció 1: Intentar amb un servei d'expansió d'URL (cors-anywhere o similar)
        // Però és més fiable demanar a l'usuari que obri l'enllaç
        
        // Opció 2: Obrir en nova finestra i demanar que copiï la URL
        window.open(urlCurta, '_blank', 'noopener,noreferrer');
        
        setError(
          "S'ha obert l'enllaç en una nova pestanya. Si us plau, copia la URL completa de la barra d'adreces i enganxa-la aquí."
        );
        return null;
      }

      return urlCurta;
    } catch (e) {
      console.error('Error expandint URL:', e);
      return null;
    }
  }

  function extreureCoordenadesDeUrl(url: string): { lat: number; lng: number } | null {
    // Netejar la URL (decodificar caràcters especials)
    const urlDecodificada = decodeURIComponent(url);
    
    // Patró 1: google.com/maps?q=lat,lng
    const qMatch = urlDecodificada.match(/[?&]q=(-?\d+\.?\d*),(-?\d+\.?\d*)/);
    if (qMatch) {
      return { lat: parseFloat(qMatch[1]), lng: parseFloat(qMatch[2]) };
    }

    // Patró 2: google.com/maps/@lat,lng,zoom
    const atMatch = urlDecodificada.match(/@(-?\d+\.?\d*),(-?\d+\.?\d*)/);
    if (atMatch) {
      return { lat: parseFloat(atMatch[1]), lng: parseFloat(atMatch[2]) };
    }

    // Patró 3: 3dLAT!4dLNG (format nou de Google Maps)
    const dMatch = urlDecodificada.match(/3d(-?\d+\.?\d*)!4d(-?\d+\.?\d*)/);
    if (dMatch) {
      return { lat: parseFloat(dMatch[1]), lng: parseFloat(dMatch[2]) };
    }

    // Patró 4: ll@LAT,LNG (format ll=lat,lng)
    const llMatch = urlDecodificada.match(/[?&]ll=(-?\d+\.?\d*),(-?\d+\.?\d*)/);
    if (llMatch) {
      return { lat: parseFloat(llMatch[1]), lng: parseFloat(llMatch[2]) };
    }

    // Patró 5: 1sLAT!2sLNG (format alternatiu)
    const sMatch = urlDecodificada.match(/1s(-?\d+\.?\d*)!2s(-?\d+\.?\d*)/);
    if (sMatch) {
      return { lat: parseFloat(sMatch[1]), lng: parseFloat(sMatch[2]) };
    }

    return null;
  }

  async function processarUrl() {
    setError('');
    setCarregant(true);
    setUrlExpandida('');

    try {
      if (!url.trim()) {
        throw new Error('Introdueix una URL de Google Maps.');
      }

      // Verificar si és un enllaç curt
      if (url.includes('maps.app.goo.gl') || url.includes('goo.gl/maps')) {
        const confirmacio = confirm(
          "Els enllaços curts de Google Maps no es poden processar directament.\n\n" +
          "Vols que obrim l'enllaç en una nova pestanya perquè puguis copiar la URL completa?"
        );
        
        if (confirmacio) {
          window.open(url, '_blank', 'noopener,noreferrer');
          setError(
            "S'ha obert l'enllaç en una nova pestanya. Copia la URL completa de la barra d'adreces, torna aquí i enganxa-la."
          );
        }
        setCarregant(false);
        return;
      }

      // Verificar que sigui de Google Maps
      if (!url.includes('google.com/maps') && !url.includes('google.cat/maps')) {
        throw new Error('URL no vàlida. Ha de ser un enllaç de Google Maps.');
      }

      const coordenades = extreureCoordenadesDeUrl(url);
      
      if (!coordenades) {
        throw new Error(
          'No s\'han pogut extreure les coordenades.\n\n' +
          'Prova d\'obrir l\'enllaç, espera que es carregui del tot, i copia la URL completa des de la barra d\'adreces del navegador.'
        );
      }

      // Validar rang de coordenades (món)
      if (Math.abs(coordenades.lat) > 90 || Math.abs(coordenades.lng) > 180) {
        throw new Error('Coordenades fora de rang vàlid.');
      }

      // Obtenir direcció amb geocodificació inversa (OpenStreetMap - gratuït)
      let direccio = '';
      let nomLloc = '';
      
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coordenades.lat}&lon=${coordenades.lng}&accept-language=ca&extratags=1&namedetails=1`
        );
        const data = await response.json();
        
        direccio = data.display_name || '';
        
        // Intentar obtenir el nom del lloc
        if (data.namedetails?.name) {
          nomLloc = data.namedetails.name;
        } else if (data.extratags?.name) {
          nomLloc = data.extratags.name;
        }
      } catch (e) {
        console.log('No s\'ha pogut obtenir la direcció');
      }

      // Cridar la funció pare amb les dades
      onCoordenadesTrobades(coordenades.lat, coordenades.lng, direccio);
      
      // Mostrar missatge d'èxit
      setUrlExpandida(`Coordenades trobades: ${coordenades.lat.toFixed(4)}, ${coordenades.lng.toFixed(4)}${nomLloc ? ' (' + nomLloc + ')' : ''}`);
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
        Enganxa l&apos;enllaç de Google Maps (funciona amb enllaços llargs i curts)
      </p>

      <div className="flex gap-2">
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && processarUrl()}
          placeholder="https://maps.app.goo.gl/... o https://www.google.com/maps/..."
          className="input-field flex-1"
        />
        <button
          type="button"
          onClick={processarUrl}
          disabled={carregant || !url.trim()}
          className="btn-secondary flex items-center gap-2 disabled:opacity-50 whitespace-nowrap"
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
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm whitespace-pre-line">{error}</p>
          {error.includes('nova pestanya') && (
            <button
              type="button"
              onClick={() => window.open(url, '_blank', 'noopener,noreferrer')}
              className="mt-2 text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              Obrir enllaç <ExternalLink className="w-3 h-3" />
            </button>
          )}
        </div>
      )}

      {urlExpandida && (
        <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-700 text-sm">✅ {urlExpandida}</p>
        </div>
      )}

      <div className="mt-3 space-y-1">
        <p className="text-xs text-blue-600">
          💡 <strong>Com funciona:</strong>
        </p>
        <ul className="text-xs text-blue-600 list-disc list-inside space-y-1">
          <li>Enllaços llargs (google.com/maps): Es processen automàticament</li>
          <li>Enllaços curts (maps.app.goo.gl): S&apos;obriran en nova pestanya per copiar la URL completa</li>
          <li>Alternativa: Clica dret a Google Maps → &quot;Què hi ha aquí?&quot; i copia les coordenades</li>
        </ul>
      </div>
    </div>
  );
}
