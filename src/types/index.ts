export type Restaurant = {
  id: string;
  nom: string;
  direccio: string;
  lat: number;
  lng: number;
  barri: string;
  ciutat: string;
  preuMig: number;
  tipusCuina: TipusCuina;
  tipusApats: TipusApat[];
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
  notes?: string | null;
  telefon?: string | null;
  web?: string | null;
  instagram?: string | null;
  dataAddicio: Date;
  afegitPer: string;
};

export type TipusCuina = 
  | 'ITALIANA'
  | 'JAPONESA'
  | 'MEXICANA'
  | 'CATALANA'
  | 'MEDITERRANIA'
  | 'ASIATICA'
  | 'FRANCESA'
  | 'AMERICANA'
  | 'ARAB'
  | 'INDIA'
  | 'VEGANA'
  | 'VEGETARIANA'
  | 'FUSIO'
  | 'ALTRES';

export type TipusApat = 
  | 'ESMORZAR'
  | 'DINAR'
  | 'SOPAR'
  | 'BRUNCH'
  | 'VERMUT'
  | 'TAPES';

export const TIPUS_CUINA_OPTIONS: { value: TipusCuina; label: string }[] = [
  { value: 'ITALIANA', label: 'Italiana' },
  { value: 'JAPONESA', label: 'Japonesa' },
  { value: 'MEXICANA', label: 'Mexicana' },
  { value: 'CATALANA', label: 'Catalana' },
  { value: 'MEDITERRANIA', label: 'Mediterrània' },
  { value: 'ASIATICA', label: 'Asiàtica' },
  { value: 'FRANCESA', label: 'Francesa' },
  { value: 'AMERICANA', label: 'Americana' },
  { value: 'ARAB', label: 'Àrab' },
  { value: 'INDIA', label: 'Índia' },
  { value: 'VEGANA', label: 'Vegana' },
  { value: 'VEGETARIANA', label: 'Vegetariana' },
  { value: 'FUSIO', label: 'Fusió' },
  { value: 'ALTRES', label: 'Altres' },
];

export const TIPUS_APAT_OPTIONS: { value: TipusApat; label: string }[] = [
  { value: 'ESMORZAR', label: 'Esmorzar' },
  { value: 'DINAR', label: 'Dinar' },
  { value: 'SOPAR', label: 'Sopar' },
  { value: 'BRUNCH', label: 'Brunch' },
  { value: 'VERMUT', label: 'Vermut' },
  { value: 'TAPES', label: 'Tapes' },
];

export const PUNTUACIO_LABELS: Record<string, string> = {
  puntuacioMenjar: 'Menjar',
  puntuacioAmbient: 'Ambient',
  puntuacioServei: 'Servei',
  puntuacioQualitatPreu: 'Qualitat/Preu',
  puntuacioOriginalitat: 'Originalitat',
  puntuacioSostenibilitat: 'Sostenibilitat',
  puntuacioAccessibilitat: 'Accessibilitat',
  puntuacioTerrassa: 'Terrassa',
  puntuacioCartaVins: 'Carta de vins',
  puntuacioRapidesa: 'Rapidesa',
};

export type FiltresCerca = {
  query?: string;
  ciutat?: string;
  barri?: string;
  tipusCuina?: TipusCuina[];
  tipusApats?: TipusApat[];
  preuMin?: number;
  preuMax?: number;
  puntuacioMinima?: number;
  lat?: number;
  lng?: number;
  distanciaKm?: number;
  ordenarPer?: 'distancia' | 'preu' | 'puntuacio' | 'nom';
};
