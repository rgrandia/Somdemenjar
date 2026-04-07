'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Search, 
  Plus, 
  MapPin, 
  Euro, 
  UtensilsCrossed,
  Star,
  Filter,
  X
} from 'lucide-react';
import { Restaurant, FiltresCerca, TIPUS_CUINA_OPTIONS, TIPUS_APAT_OPTIONS } from '@/types';
import { formatPreu, calcularPuntuacioGlobal, calcularDistancia } from '@/lib/utils';
import RestaurantCard from '@/components/RestaurantCard';
import FiltresPanel from '@/components/FiltresPanel';
import { obtenirRestaurants } from '@/lib/sheets';

export default function Home() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [restaurantsFiltrats, setRestaurantsFiltrats] = useState<Restaurant[]>([]);
  const [carregant, setCarregant] = useState(true);
  const [error, setError] = useState('');
  const [mostrarFiltres, setMostrarFiltres] = useState(false);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  
  const [filtres, setFiltres] = useState<FiltresCerca>({
    query: '',
    ciutat: '',
    barri: '',
    tipusCuina: [],
    tipusApats: [],
    preuMin: undefined,
    preuMax: undefined,
    puntuacioMinima: undefined,
    ordenarPer: 'puntuacio',
  });

  useEffect(() => {
    carregarRestaurants();
    obtenirUbicacio();
  }, []);

  useEffect(() => {
    aplicarFiltres();
  }, [filtres, restaurants, userLocation]);

  async function carregarRestaurants() {
    try {
      setCarregant(true);
      setError('');
      console.log('Iniciant càrrega de restaurants...');
      
      const dades = await obtenirRestaurants();
      console.log('Restaurants rebuts:', dades.length, dades);
      
      setRestaurants(dades);
    } catch (error: any) {
      console.error('Error carregant restaurants:', error);
      setError('Error carregant restaurants: ' + error.message);
    } finally {
      setCarregant(false);
    }
  }

  function obtenirUbicacio() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.log('Geolocalització no disponible');
        }
      );
    }
  }

  function aplicarFiltres() {
    let resultats = [...restaurants];

    // Cerca per text (nom, direcció, barri)
    if (filtres.query) {
      const query = filtres.query.toLowerCase();
      resultats = resultats.filter(
        (r) =>
          r.nom.toLowerCase().includes(query) ||
          r.direccio.toLowerCase().includes(query) ||
          r.barri.toLowerCase().includes(query)
      );
    }

    // Filtre per ciutat
    if (filtres.ciutat) {
      resultats = resultats.filter(
        (r) => r.ciutat.toLowerCase() === filtres.ciutat?.toLowerCase()
      );
    }

    // Filtre per barri
    if (filtres.barri) {
      resultats = resultats.filter(
        (r) => r.barri.toLowerCase().includes(filtres.barri!.toLowerCase())
      );
    }

    // Filtre per tipus de cuina
    if (filtres.tipusCuina && filtres.tipusCuina.length > 0) {
      resultats = resultats.filter((r) =>
        filtres.tipusCuina!.includes(r.tipusCuina)
      );
    }

    // Filtre per tipus d'àpat
    if (filtres.tipusApats && filtres.tipusApats.length > 0) {
      resultats = resultats.filter((r) =>
        filtres.tipusApats!.some((apat) => r.tipusApats.includes(apat))
      );
    }

    // Filtre per rang de preu
    if (filtres.preuMin !== undefined) {
      resultats = resultats.filter((r) => r.preuMig >= filtres.preuMin!);
    }
    if (filtres.preuMax !== undefined) {
      resultats = resultats.filter((r) => r.preuMig <= filtres.preuMax!);
    }

    // Filtre per puntuació mínima
    if (filtres.puntuacioMinima !== undefined) {
      resultats = resultats.filter(
        (r) => calcularPuntuacioGlobal(r) >= filtres.puntuacioMinima!
      );
    }

    // Filtre per distància
    if (filtres.distanciaKm && userLocation) {
      resultats = resultats.filter((r) => {
        const distancia = calcularDistancia(
          userLocation.lat,
          userLocation.lng,
          r.lat,
          r.lng
        );
        return distancia <= filtres.distanciaKm!;
      });
    }

    // Ordenació
    if (filtres.ordenarPer === 'distancia' && userLocation) {
      resultats.sort((a, b) => {
        const distA = calcularDistancia(userLocation.lat, userLocation.lng, a.lat, a.lng);
        const distB = calcularDistancia(userLocation.lat, userLocation.lng, b.lat, b.lng);
        return distA - distB;
      });
    } else if (filtres.ordenarPer === 'preu') {
      resultats.sort((a, b) => a.preuMig - b.preuMig);
    } else if (filtres.ordenarPer === 'puntuacio') {
      resultats.sort((a, b) => calcularPuntuacioGlobal(b) - calcularPuntuacioGlobal(a));
    } else if (filtres.ordenarPer === 'nom') {
      resultats.sort((a, b) => a.nom.localeCompare(b.nom));
    }

    setRestaurantsFiltrats(resultats);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-red-600 p-2 rounded-lg">
                <UtensilsCrossed className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">SomDeMenjar</h1>
            </div>
            <Link
              href="/afegir"
              className="btn-primary flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Afegir restaurant
            </Link>
          </div>
        </div>
      </header>

      {/* Barra de cerca */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-xl shadow-md p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Cerca per nom, direcció o barri..."
                className="input-field pl-10"
                value={filtres.query || ''}
                onChange={(e) =>
                  setFiltres({ ...filtres, query: e.target.value })
                }
              />
            </div>
            <button
              onClick={() => setMostrarFiltres(!mostrarFiltres)}
              className="btn-secondary flex items-center justify-center gap-2"
            >
              <Filter className="w-4 h-4" />
              Filtres
              {mostrarFiltres ? <X className="w-4 h-4" /> : null}
            </button>
          </div>

          {/* Panel de filtres */}
          {mostrarFiltres && (
            <FiltresPanel
              filtres={filtres}
              setFiltres={setFiltres}
              userLocation={userLocation}
            />
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-800 rounded-lg">
            {error}
          </div>
        )}

        {/* Resultats */}
        <div className="mb-4 flex items-center justify-between">
          <p className="text-gray-600">
            {restaurantsFiltrats.length} restaurant
            {restaurantsFiltrats.length !== 1 ? 's' : ''} trobat
            {restaurantsFiltrats.length !== 1 ? 's' : ''}
          </p>
          <select
            className="input-field w-auto"
            value={filtres.ordenarPer}
            onChange={(e) =>
              setFiltres({
                ...filtres,
                ordenarPer: e.target.value as any,
              })
            }
          >
            <option value="puntuacio">Ordenar per puntuació</option>
            <option value="distancia">Ordenar per distància</option>
            <option value="preu">Ordenar per preu</option>
            <option value="nom">Ordenar per nom</option>
          </select>
        </div>

        {/* Grid de restaurants */}
        {carregant ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Carregant restaurants...</p>
          </div>
        ) : restaurantsFiltrats.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-md">
            <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No s'han trobat restaurants
            </h3>
            <p className="text-gray-600 mb-4">
              {restaurants.length === 0 
                ? "No hi ha restaurants al sheet o hi ha un error de connexió"
                : "Prova a ajustar els filtres o afegeix un nou restaurant"
              }
            </p>
            {restaurants.length === 0 && (
              <button 
                onClick={carregarRestaurants}
                className="btn-primary"
              >
                Reintentar
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurantsFiltrats.map((restaurant) => (
              <RestaurantCard
                key={restaurant.id}
                restaurant={restaurant}
                userLocation={userLocation}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
