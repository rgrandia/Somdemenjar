// src/lib/sheets.ts
import { Restaurant, TipusCuina, TipusApat } from '@/types';

// ENGANXA AQUÍ LA URL DEL TEU WEB APP
const APPS_SCRIPT_URL = process.env.NEXT_PUBLIC_APPS_SCRIPT_URL || '';

export async function obtenirRestaurants(): Promise<Restaurant[]> {
  try {
    const response = await fetch(`${APPS_SCRIPT_URL}?action=getAll`);
    const data = await response.json();
    
    if (data.error) throw new Error(data.error);
    
    return data.restaurants.map((r: any) => ({
      id: String(r.id),
      nom: r.nom,
      direccio: r.direccio,
      lat: r.lat,
      lng: r.lng,
      barri: r.barri,
      ciutat: r.ciutat,
      preuMig: r.preuMig,
      tipusCuina: r.tipusCuina as TipusCuina,
      tipusApats: r.tipusApats as TipusApat[],
      puntuacioMenjar: r.puntuacioMenjar,
      puntuacioAmbient: r.puntuacioAmbient,
      puntuacioServei: r.puntuacioServei,
      puntuacioQualitatPreu: r.puntuacioQualitatPreu,
      puntuacioOriginalitat: r.puntuacioOriginalitat,
      puntuacioSostenibilitat: r.puntuacioSostenibilitat,
      puntuacioAccessibilitat: r.puntuacioAccessibilitat,
      puntuacioTerrassa: r.puntuacioTerrassa,
      puntuacioCartaVins: r.puntuacioCartaVins,
      puntuacioRapidesa: r.puntuacioRapidesa,
      notes: r.notes,
      telefon: r.telefon,
      web: r.web,
      instagram: r.instagram,
      dataAddicio: r.dataAddicio,
      afegitPer: r.afegitPer,
    }));
  } catch (error) {
    console.error('Error carregant restaurants:', error);
    return [];
  }
}

export async function afegirRestaurant(
  restaurant: Omit<Restaurant, 'id' | 'dataAddicio'>,
  password: string
) {
  const response = await fetch(APPS_SCRIPT_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'add',
      password: password,
      restaurant: restaurant,
    }),
  });

  const data = await response.json();
  
  if (!response.ok || data.error) {
    throw new Error(data.error || 'Error guardant restaurant');
  }
  
  return data;
}

export async function eliminarRestaurant(id: string, password: string) {
  const response = await fetch(APPS_SCRIPT_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'delete',
      password: password,
      id: id,
    }),
  });

  const data = await response.json();
  
  if (!response.ok || data.error) {
    throw new Error(data.error || 'Error eliminant restaurant');
  }
  
  return data;
}
