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
        filtres.tipusCuina!.
