// src/lib/sheets.ts
import { Restaurant, TipusCuina, TipusApat } from '@/types';

const APPS_SCRIPT_URL = process.env.NEXT_PUBLIC_APPS_SCRIPT_URL || '';

export async function obtenirRestaurants(): Promise<Restaurant[]> {
  try {
    const response = await fetch(`${APPS_SCRIPT_URL}?action=getAll`);
    const data = await response.json();
    
    if (data.error) throw new Error(data.error);
    
    return data.restaurants.map((r: any) => ({
      id: String(r.id),
      nom: r.nom || '',
      direccio: r.direccio || '',
      lat: parseFloat(r.lat) || 0,
      lng: parseFloat(r.lng) || 0,
      barri: r.barri || '',
      ciutat: r.ciutat || '',
      preuMig: parseFloat(r.preuMig) || 0,
      tipusCuina: (r.tipusCuina as TipusCuina) || 'ALTRES',
      tipusApats: Array.isArray(r.tipusApats) ? r.tipusApats : (r.tipusApats || '').split(',').filter((x: string) => x),
      puntuacioMenjar: parseInt(r.puntuacioMenjar) || 0,
      puntuacioAmbient: parseInt(r.puntuacioAmbient) || 0,
      puntuacioServei: parseInt(r.puntuacioServei) || 0,
      puntuacioQualitatPreu: parseInt(r.puntuacioQualitatPreu) || 0,
      puntuacioOriginalitat: parseInt(r.puntuacioOriginalitat) || 0,
      puntuacioSostenibilitat: parseInt(r.puntuacioSostenibilitat) || 0,
      puntuacioAccessibilitat: parseInt(r.puntuacioAccessibilitat) || 0,
      puntuacioTerrassa: parseInt(r.puntuacioTerrassa) || 0,
      puntuacioCartaVins: parseInt(r.puntuacioCartaVins) || 0,
      puntuacioRapidesa: parseInt(r.puntuacioRapidesa) || 0,
      notes: r.notes || '',
      // Camps de contacte - opcionals, poden no existir al sheet
      telefon: r.telefon || '',
      web: r.web || '',
      instagram: r.instagram || '',
      dataAddicio: r.dataAddicio || new Date().toISOString(),
      afegitPer: r.afegitPer || 'Anònim',
    }));
  } catch (error) {
    console.error('Error carregant restaurants:', error);
    return [];
  }
}

export async function afegirRestaurant(
  restaurant: any,
  password: string
) {
  console.log('Enviant a Apps Script:', APPS_SCRIPT_URL);
  console.log('Dades:', { action: 'add', password: '***', restaurant });

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
  console.log('Resposta Apps Script:', data);
  
  if (!response.ok || data.error) {
    throw new Error(data.error || 'Error guardant restaurant');
  }
  
  return data;
}
