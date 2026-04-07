'use server';

import { afegirRestaurant } from '@/lib/sheets';
import { TipusCuina, TipusApat } from '@/types';
import { revalidatePath } from 'next/cache';

const ADD_PASSWORD = process.env.ADD_PASSWORD || 'GRANDIA';

export type ActionState = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
};

export async function crearRestaurant(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    // Verificar contrasenya
    const password = formData.get('password') as string;
    if (password !== ADD_PASSWORD) {
      return {
        success: false,
        message: 'Contrasenya incorrecta',
        errors: { password: ['La contrasenya no és correcta'] },
      };
    }

    // Validar camps obligatoris
    const nom = formData.get('nom') as string;
    const direccio = formData.get('direccio') as string;
    const lat = parseFloat(formData.get('lat') as string);
    const lng = parseFloat(formData.get('lng') as string);
    const barri = formData.get('barri') as string;
    const ciutat = formData.get('ciutat') as string;
    const preuMig = parseFloat(formData.get('preuMig') as string);
    const tipusCuina = formData.get('tipusCuina') as TipusCuina;

    if (!nom || !direccio || isNaN(lat) || isNaN(lng) || !barri || !ciutat || isNaN(preuMig) || !tipusCuina) {
      return {
        success: false,
        message: 'Falten camps obligatoris',
        errors: { general: ['Tots els camps marcats amb * són obligatoris'] },
      };
    }

    // Processar tipus d'àpats
    const tipusApats = formData.getAll('tipusApats') as TipusApat[];

    // Crear objecte restaurant
    const restaurant = {
      nom,
      direccio,
      lat,
      lng,
      barri,
      ciutat,
      preuMig,
      tipusCuina,
      tipusApats: tipusApats.length > 0 ? tipusApats : [],
      puntuacioMenjar: parseInt(formData.get('puntuacioMenjar') as string) || 0,
      puntuacioAmbient: parseInt(formData.get('puntuacioAmbient') as string) || 0,
      puntuacioServei: parseInt(formData.get('puntuacioServei') as string) || 0,
      puntuacioQualitatPreu: parseInt(formData.get('puntuacioQualitatPreu') as string) || 0,
      puntuacioOriginalitat: parseInt(formData.get('puntuacioOriginalitat') as string) || 0,
      puntuacioSostenibilitat: parseInt(formData.get('puntuacioSostenibilitat') as string) || 0,
      puntuacioAccessibilitat: parseInt(formData.get('puntuacioAccessibilitat') as string) || 0,
      puntuacioTerrassa: parseInt(formData.get('puntuacioTerrassa') as string) || 0,
      puntuacioCartaVins: parseInt(formData.get('puntuacioCartaVins') as string) || 0,
      puntuacioRapidesa: parseInt(formData.get('puntuacioRapidesa') as string) || 0,
      notes: formData.get('notes') as string || '',
      telefon: formData.get('telefon') as string || '',
      web: formData.get('web') as string || '',
      instagram: formData.get('instagram') as string || '',
      afegitPer: formData.get('afegitPer') as string || 'Anònim',
    };

    // Guardar a Google Sheets
    await afegirRestaurant(restaurant);

    revalidatePath('/');
    
    return {
      success: true,
      message: `Restaurant "${nom}" creat correctament!`,
    };
  } catch (error) {
    console.error('Error creant restaurant:', error);
    return {
      success: false,
      message: 'Error en crear el restaurant',
      errors: { general: ['Hi ha hagut un error inesperat'] },
    };
  }
}
