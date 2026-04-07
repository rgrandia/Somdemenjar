// src/lib/sheets.ts
import { Restaurant, TipusCuina, TipusApat } from '@/types';

const SHEET_ID = process.env.NEXT_PUBLIC_SHEET_ID || '';
const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY || '';

// Rang on es guarden les dades (ajusta segons el teu sheet)
const RANGE = 'A2:Z1000'; // Assumint que la fila 1 són les capçaleres

export async function obtenirRestaurants(): Promise<Restaurant[]> {
  try {
    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?key=${API_KEY}`
    );
    
    if (!response.ok) throw new Error('Error carregant dades');
    
    const data = await response.json();
    const rows = data.values || [];
    
    return rows.map((row: any[], index: number) => ({
      id: row[0] || String(index),
      nom: row[1] || '',
      direccio: row[2] || '',
      lat: parseFloat(row[3]) || 0,
      lng: parseFloat(row[4]) || 0,
      barri: row[5] || '',
      ciutat: row[6] || '',
      preuMig: parseFloat(row[7]) || 0,
      tipusCuina: (row[8] as TipusCuina) || 'ALTRES',
      tipusApats: (row[9]?.split(',') as TipusApat[]) || [],
      puntuacioMenjar: parseInt(row[10]) || 0,
      puntuacioAmbient: parseInt(row[11]) || 0,
      puntuacioServei: parseInt(row[12]) || 0,
      puntuacioQualitatPreu: parseInt(row[13]) || 0,
      puntuacioOriginalitat: parseInt(row[14]) || 0,
      puntuacioSostenibilitat: parseInt(row[15]) || 0,
      puntuacioAccessibilitat: parseInt(row[16]) || 0,
      puntuacioTerrassa: parseInt(row[17]) || 0,
      puntuacioCartaVins: parseInt(row[18]) || 0,
      puntuacioRapidesa: parseInt(row[19]) || 0,
      notes: row[20] || '',
      telefon: row[21] || '',
      web: row[22] || '',
      instagram: row[23] || '',
      dataAddicio: row[24] || new Date().toISOString(),
      afegitPer: row[25] || 'Anònim',
    }));
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
}

export async function afegirRestaurant(restaurant: Omit<Restaurant, 'id' | 'dataAddicio'>) {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}:append?valueInputOption=USER_ENTERED&key=${API_KEY}`;
  
  const values = [[
    Date.now().toString(), // ID únic
    restaurant.nom,
    restaurant.direccio,
    restaurant.lat,
    restaurant.lng,
    restaurant.barri,
    restaurant.ciutat,
    restaurant.preuMig,
    restaurant.tipusCuina,
    restaurant.tipusApats.join(','),
    restaurant.puntuacioMenjar,
    restaurant.puntuacioAmbient,
    restaurant.puntuacioServei,
    restaurant.puntuacioQualitatPreu,
    restaurant.puntuacioOriginalitat,
    restaurant.puntuacioSostenibilitat,
    restaurant.puntuacioAccessibilitat,
    restaurant.puntuacioTerrassa,
    restaurant.puntuacioCartaVins,
    restaurant.puntuacioRapidesa,
    restaurant.notes,
    restaurant.telefon,
    restaurant.web,
    restaurant.instagram,
    new Date().toISOString(),
    restaurant.afegitPer,
  ]];

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ values }),
  });

  if (!response.ok) throw new Error('Error guardant restaurant');
  return response.json();
}
