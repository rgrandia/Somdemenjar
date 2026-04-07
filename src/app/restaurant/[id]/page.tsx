'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { 
  ArrowLeft, 
  MapPin, 
  Euro, 
  Star,
  Phone,
  Globe,
  Instagram,
  Calendar,
  User,
  Trash2,
  ExternalLink
} from 'lucide-react';
import { Restaurant } from '@/types';
import { formatPreu, formatData, calcularPuntuacioGlobal } from '@/lib/utils';

export default function DetallRestaurant() {
  const params = useParams();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [carregant, setCarregant] = useState(true);
  const [error, setError] = useState('');
  const [password, setPassword] = useState('');
  const [mostrarEliminar, setMostrarEliminar] = useState(false);

  useEffect(() => {
    carregarRestaurant();
  }, [params.id]);

  async function carregarRestaurant() {
    try {
      const resposta = await fetch(`/api/restaurants/${params.id}`);
      if (!resposta.ok) throw new Error('Restaurant no trobat');
      const dades = await resposta.json();
      setRestaurant(dades);
    } catch (err) {
      setError('No s'ha pogut carregar el restaurant');
    } finally {
      setCarregant(false);
    }
  }

  async function eliminarRestaurant() {
    if (!password) return;

    try {
      const resposta = await fetch(`/api/restaurants/${params.id}?password=${encodeURIComponent(password)}`, {
        method: 'DELETE',
      });

      if (resposta.ok) {
        window.location.href = '/';
      } else {
        const error = await resposta.json();
        alert(error.error || 'Error eliminant el restaurant');
      }
    } catch (err) {
      alert('Error de connexió');
    }
  }

  if (carregant) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (error || !restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Restaurant no trobat</h1>
          <Link href="/" className="btn-primary">
            Tornar a l'inici
          </Link>
        </div>
      </div>
    );
  }

  const puntuacioGlobal = calcularPuntuacioGlobal(restaurant);

  const puntuacions = [
    { label: 'Menjar', value: restaurant.puntuacioMenjar },
    { label: 'Ambient', value: restaurant.puntuacioAmbient },
    { label: 'Servei', value: restaurant.puntuacioServei },
    { label: 'Qualitat/Preu', value: restaurant.puntuacioQualitatPreu },
    { label: 'Originalitat', value: restaurant.puntuacioOriginalitat },
    { label: 'Sostenibilitat', value: restaurant.puntuacioSostenibilitat },
    { label: 'Accessibilitat', value: restaurant.puntuacioAccessibilitat },
    { label: 'Terrassa', value: restaurant.puntuacioTerrassa },
    { label: 'Carta de vins', value: restaurant.puntuacioCartaVins },
    { label: 'Rapidesa', value: restaurant.puntuacioRapidesa },
  ];

  const getTipusCuinaLabel = (tipus: string) => {
    const map: Record<string, string> = {
      'ITALIANA': 'Italiana',
      'JAPONESA': 'Japonesa',
      'MEXICANA': 'Mexicana',
      'CATALANA': 'Catalana',
      'MEDITERRANIA': 'Mediterrània',
      'ASIATICA': 'Asiàtica',
      'FRANCESA': 'Francesa',
      'AMERICANA': 'Americana',
      'ARAB': 'Àrab',
      'INDIA': 'Índia',
      'VEGANA': 'Vegana',
      'VEGETARIANA': 'Vegetariana',
      'FUSIO': 'Fusió',
      'ALTRES': 'Altres',
    };
    return map[tipus] || tipus;
  };

  const getTipusApatLabel = (tipus: string) => {
    const map: Record<string, string> = {
      'ESMORZAR': 'Esmorzar',
      'DINAR': 'Dinar',
      'SOPAR': 'Sopar',
      'BRUNCH': 'Brunch',
      'VERMUT': 'Vermut',
      'TAPES': 'Tapes',
    };
    return map[tipus] || tipus;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navegació */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Tornar al cercador
        </Link>

        {/* Header */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{restaurant.nom}</h1>
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                  {getTipusCuinaLabel(restaurant.tipusCuina)}
                </span>
                {restaurant.tipusApats.map((apat) => (
                  <span
                    key={apat}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                  >
                    {getTipusApatLabel(apat)}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2 bg-yellow-100 px-4 py-2 rounded-lg">
              <Star className="w-6 h-6 text-yellow-600 fill-yellow-600" />
              <div>
                <div className="text-2xl font-bold text-yellow-800">{puntuacioGlobal}</div>
                <div className="text-xs text-yellow-700">Puntuació global</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Informació general */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-red-600" />
              Informació
            </h2>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-500">Direcció</label>
                <p className="font-medium">{restaurant.direccio}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Barri / Ciutat</label>
                <p className="font-medium">{restaurant.barri}, {restaurant.ciutat}</p>
              </div>
              <div className="flex items-center gap-2">
                <Euro className="w-4 h-4 text-gray-400" />
                <span className="font-medium">{formatPreu(restaurant.preuMig)} / persona</span>
              </div>

              {restaurant.telefon && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <a href={`tel:${restaurant.telefon}`} className="text-red-600 hover:underline">
                    {restaurant.telefon}
                  </a>
                </div>
              )}

              {restaurant.web && (
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-gray-400" />
                  <a 
                    href={restaurant.web} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-red-600 hover:underline flex items-center gap-1"
                  >
                    Web <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}

              {restaurant.instagram && (
                <div className="flex items-center gap-2">
                  <Instagram className="w-4 h-4 text-gray-400" />
                  <a 
                    href={`https://instagram.com/${restaurant.instagram.replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-red-600 hover:underline flex items-center gap-1"
                  >
                    {restaurant.instagram} <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}

              <div className="pt-3 border-t border-gray-100">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar className="w-4 h-4" />
                  Afegit el {formatData(restaurant.dataAddicio)}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                  <User className="w-4 h-4" />
                  Per {restaurant.afegitPer}
                </div>
              </div>
            </div>
          </div>

          {/* Puntuacions detallades */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" />
              Puntuacions
            </h2>
            <div className="space-y-3">
              {puntuacions.map((p) => (
                <div key={p.label} className="flex items-center justify-between">
                  <span className="text-gray-700">{p.label}</span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((estrella) => (
                      <Star
                        key={estrella}
                        className={`w-4 h-4 ${
                          estrella <= p.value
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Notes */}
        {restaurant.notes && (
          <div className="bg-white rounded-xl shadow-md p-6 mt-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Notes</h2>
            <p className="text-gray-700 whitespace-pre-wrap">{restaurant.notes}</p>
          </div>
        )}

        {/* Botó eliminar */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          {!mostrarEliminar ? (
            <button
              onClick={() => setMostrarEliminar(true)}
              className="flex items-center gap-2 text-red-600 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4" />
              Eliminar restaurant
            </button>
          ) : (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 mb-3">Introdueix la contrasenya per confirmar l'eliminació:</p>
              <div className="flex gap-2">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Contrasenya"
                  className="input-field w-auto"
                />
                <button
                  onClick={eliminarRestaurant}
                  className="btn-primary bg-red-600 hover:bg-red-700"
                >
                  Confirmar
                </button>
                <button
                  onClick={() => setMostrarEliminar(false)}
                  className="btn-secondary"
                >
                  Cancel·lar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
