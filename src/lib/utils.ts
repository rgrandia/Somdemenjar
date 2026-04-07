import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPreu(preu: number): string {
  return `${preu.toFixed(2)} €`;
}

export function formatData(data: Date): string {
  return new Date(data).toLocaleDateString('ca-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function calcularPuntuacioGlobal(restaurant: {
  puntuacioMenjar: number;
  puntuacioAmbient: number;
  puntuacioServei: number;
  puntuacioQualitatPreu: number;
  puntuacioOriginalitat: number;
  puntuacioSostenibilitat: number;
  puntuacioAccessibilitat: number;
  puntuacioTerrassa: number;
  puntuacioCartaVins: number;
  puntuacioRapidesa: number;
}): number {
  const suma = 
    restaurant.puntuacioMenjar +
    restaurant.puntuacioAmbient +
    restaurant.puntuacioServei +
    restaurant.puntuacioQualitatPreu +
    restaurant.puntuacioOriginalitat +
    restaurant.puntuacioSostenibilitat +
    restaurant.puntuacioAccessibilitat +
    restaurant.puntuacioTerrassa +
    restaurant.puntuacioCartaVins +
    restaurant.puntuacioRapidesa;

  return parseFloat((suma / 10).toFixed(1));
}

export function calcularDistancia(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371; // Radi de la Terra en km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLng = (lng2 - lng1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return parseFloat((R * c).toFixed(2));
}
