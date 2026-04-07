'use client';

import Link from 'next/link';
import { MapPin, Euro, Star, ExternalLink } from 'lucide-react';
import { Restaurant } from '@/types';
import { formatPreu, calcularPuntuacioGlobal, calcularDistancia } from '@/lib/utils';

interface RestaurantCardProps {
  restaurant: Restaurant;
  userLocation?: { lat: number; lng: number } | null;
}

export default function RestaurantCard({ restaurant, userLocation }: RestaurantCardProps) {
  const puntuacioGlobal = calcularPuntuacioGlobal(restaurant);

  let distancia: number | null = null;
  if (userLocation) {
    distancia = calcularDistancia(
      userLocation.lat,
      userLocation.lng,
      restaurant.lat,
      restaurant.lng
    );
  }

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
    <div className="card hover:shadow-xl transition-all duration-300">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-xl font-bold text-gray-900 line-clamp-1">{restaurant.nom}</h3>
        <div className="flex items-center gap-1 bg-yellow-100 px-2 py-1 rounded-lg">
          <Star className="w-4 h-4 text-yellow-600 fill-yellow-600" />
          <span className="font-semibold text-yellow-800">{puntuacioGlobal}</span>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-start gap-2 text-gray-600">
          <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span className="text-sm line-clamp-2">{restaurant.direccio}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <span className="text-sm font-medium">{restaurant.barri}, {restaurant.ciutat}</span>
        </div>
        {distancia !== null && (
          <div className="text-sm text-blue-600 font-medium">
            📍 A {distancia} km
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          {getTipusCuinaLabel(restaurant.tipusCuina)}
        </span>
        {restaurant.tipusApats.map((apat) => (
          <span
            key={apat}
            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
          >
            {getTipusApatLabel(apat)}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center gap-1 text-gray-700">
          <Euro className="w-4 h-4" />
          <span className="font-medium">{formatPreu(restaurant.preuMig)}</span>
          <span className="text-sm text-gray-500">/pers</span>
        </div>
        <Link
          href={`/restaurant/${restaurant.id}`}
          className="flex items-center gap-1 text-red-600 hover:text-red-700 font-medium text-sm"
        >
          Veure detalls
          <ExternalLink className="w-4 h-4" />
        </Link>
      </div>

      {restaurant.notes && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-sm text-gray-600 line-clamp-2 italic">
            "{restaurant.notes}"
          </p>
        </div>
      )}
    </div>
  );
}
