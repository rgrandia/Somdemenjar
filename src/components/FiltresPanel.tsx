'use client';

import { FiltresCerca, TIPUS_CUINA_OPTIONS, TIPUS_APAT_OPTIONS } from '@/types';
import { Euro, MapPin, Star, X } from 'lucide-react';

interface FiltresPanelProps {
  filtres: FiltresCerca;
  setFiltres: (filtres: FiltresCerca) => void;
  userLocation: { lat: number; lng: number } | null;
}

export default function FiltresPanel({ filtres, setFiltres, userLocation }: FiltresPanelProps) {
  const handleTipusCuinaChange = (value: string) => {
    const current = filtres.tipusCuina || [];
    const updated = current.includes(value as any)
      ? current.filter((t) => t !== value)
      : [...current, value as any];
    setFiltres({ ...filtres, tipusCuina: updated });
  };

  const handleTipusApatChange = (value: string) => {
    const current = filtres.tipusApats || [];
    const updated = current.includes(value as any)
      ? current.filter((t) => t !== value)
      : [...current, value as any];
    setFiltres({ ...filtres, tipusApats: updated });
  };

  const clearFiltres = () => {
    setFiltres({
      query: filtres.query,
      ordenarPer: filtres.ordenarPer,
    });
  };

  return (
    <div className="mt-4 pt-4 border-t border-gray-200">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Filtre per ciutat i barri */}
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Ubicació
          </h3>
          <div>
            <label className="label">Ciutat</label>
            <input
              type="text"
              className="input-field"
              placeholder="Ex: Barcelona"
              value={filtres.ciutat || ''}
              onChange={(e) => setFiltres({ ...filtres, ciutat: e.target.value })}
            />
          </div>
          <div>
            <label className="label">Barri</label>
            <input
              type="text"
              className="input-field"
              placeholder="Ex: Gràcia"
              value={filtres.barri || ''}
              onChange={(e) => setFiltres({ ...filtres, barri: e.target.value })}
            />
          </div>
          {userLocation && (
            <div>
              <label className="label">Distància màxima (km)</label>
              <input
                type="number"
                className="input-field"
                placeholder="5"
                value={filtres.distanciaKm || ''}
                onChange={(e) =>
                  setFiltres({ ...filtres, distanciaKm: parseFloat(e.target.value) || undefined })
                }
              />
            </div>
          )}
        </div>

        {/* Filtre per preu */}
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <Euro className="w-4 h-4" />
            Rang de preu
          </h3>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="label">Mínim (€)</label>
              <input
                type="number"
                className="input-field"
                placeholder="0"
                value={filtres.preuMin || ''}
                onChange={(e) =>
                  setFiltres({ ...filtres, preuMin: parseFloat(e.target.value) || undefined })
                }
              />
            </div>
            <div>
              <label className="label">Màxim (€)</label>
              <input
                type="number"
                className="input-field"
                placeholder="100"
                value={filtres.preuMax || ''}
                onChange={(e) =>
                  setFiltres({ ...filtres, preuMax: parseFloat(e.target.value) || undefined })
                }
              />
            </div>
          </div>
        </div>

        {/* Filtre per puntuació */}
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <Star className="w-4 h-4" />
            Puntuació mínima
          </h3>
          <div>
            <label className="label">Puntuació global mínima (0-5)</label>
            <input
              type="range"
              min="0"
              max="5"
              step="0.5"
              className="range-slider"
              value={filtres.puntuacioMinima || 0}
              onChange={(e) =>
                setFiltres({ ...filtres, puntuacioMinima: parseFloat(e.target.value) })
              }
            />
            <div className="text-center text-sm text-gray-600 mt-1">
              {filtres.puntuacioMinima || 0} / 5
            </div>
          </div>
        </div>

        {/* Filtre per tipus de cuina */}
        <div className="space-y-4 md:col-span-2">
          <h3 className="font-semibold text-gray-900">Tipus de cuina</h3>
          <div className="flex flex-wrap gap-2">
            {TIPUS_CUINA_OPTIONS.map((opcio) => (
              <button
                key={opcio.value}
                onClick={() => handleTipusCuinaChange(opcio.value)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  filtres.tipusCuina?.includes(opcio.value)
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {opcio.label}
              </button>
            ))}
          </div>
        </div>

        {/* Filtre per tipus d'àpat */}
        <div className="space-y-4 md:col-span-2">
          <h3 className="font-semibold text-gray-900">Tipus d'àpat</h3>
          <div className="flex flex-wrap gap-2">
            {TIPUS_APAT_OPTIONS.map((opcio) => (
              <button
                key={opcio.value}
                onClick={() => handleTipusApatChange(opcio.value)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  filtres.tipusApats?.includes(opcio.value)
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {opcio.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Botó netejar filtres */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={clearFiltres}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <X className="w-4 h-4" />
          Netejar filtres
        </button>
      </div>
    </div>
  );
}
