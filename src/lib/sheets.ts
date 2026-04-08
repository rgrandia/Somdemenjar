// src/lib/sheets.ts
import { Restaurant, TipusCuina, TipusApat } from '@/types';

const APPS_SCRIPT_URL =
  process.env.APPS_SCRIPT_URL || process.env.NEXT_PUBLIC_APPS_SCRIPT_URL || '';

function obtenirBaseUrlAppsScript(): string {
  const url = APPS_SCRIPT_URL.trim();

  if (!url) {
    throw new Error('Falta configurar APPS_SCRIPT_URL (o NEXT_PUBLIC_APPS_SCRIPT_URL).');
  }

  return url;
}

function parsejarRespostaJson(text: string) {
  try {
    return JSON.parse(text);
  } catch {
    const textNetejat = text.trim().replace(/^[^{[]+/, '');
    return JSON.parse(textNetejat);
  }
}

export async function obtenirRestaurants(): Promise<Restaurant[]> {
  try {
    const appsScriptUrl = obtenirBaseUrlAppsScript();
    const url = new URL(appsScriptUrl);
    url.searchParams.set('action', 'getAll');

    const response = await fetch(url.toString(), {
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = parsejarRespostaJson(await response.text());

    if (data.error) throw new Error(data.error);

    if (!data.restaurants || !Array.isArray(data.restaurants)) {
      console.error('No restaurants array in response:', data);
      return [];
    }

    return data.restaurants.map((r: any, index: number) => ({
      id: String(r.id || index),
      nom: r.nom || '',
      direccio: r.direccio || '',
      lat: parseFloat(r.lat) || 0,
      lng: parseFloat(r.lng) || 0,
      barri: r.barri || '',
      ciutat: r.ciutat || '',
      preuMig: parseFloat(r.preuMig) || 0,
      tipusCuina: (r.tipusCuina as TipusCuina) || 'ALTRES',
      tipusApats: Array.isArray(r.tipusApats)
        ? r.tipusApats
        : (r.tipusApats || '').toString().split(',').filter((x: string) => x),
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

export async function afegirRestaurant(restaurant: any, password: string) {
  const appsScriptUrl = obtenirBaseUrlAppsScript();
  const url = new URL(appsScriptUrl);
  url.searchParams.set('action', 'add');

  const response = await fetch(url.toString(), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'add',
      password,
      restaurant,
    }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = parsejarRespostaJson(await response.text());

  if (data.error) {
    throw new Error(data.error || 'Error guardant restaurant');
  }

  return data;
}
