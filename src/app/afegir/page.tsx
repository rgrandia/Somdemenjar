'use client';

import { useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  MapPin, 
  Euro, 
  Star,
  Lock,
  Info,
  Check,
  Loader2
} from 'lucide-react';
import { crearRestaurant, ActionState } from '@/app/actions';
import { TIPUS_CUINA_OPTIONS, TIPUS_APAT_OPTIONS, PUNTUACIO_LABELS } from '@/types';
import CoordenadesExtractor from '@/components/CoordenadesExtractor';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
    >
      {pending ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Creant...
        </>
      ) : (
        <>
          <Check className="w-4 h-4" />
          Afegir Restaurant
        </>
      )}
    </button>
  );
}

const initialState: ActionState = {
  success: false,
  message: '',
};

export default function AfegirRestaurant() {
  const router = useRouter();
  const [state, formAction] = useFormState(crearRestaurant, initialState);
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [carregantNom, setCarregantNom] = useState(false);

  // Si s'ha creat correctament, redirigir després d'uns segons
  if (state.success) {
    setTimeout(() => {
      router.push('/');
    }, 2000);
  }

  function handleCoordenadesTrobades(lat: number, lng: number, direccio: string) {
    // Omplir els camps del formulari
    const latInput = document.querySelector('input[name="lat"]') as HTMLInputElement;
    const lngInput = document.querySelector('input[name="lng"]') as HTMLInputElement;
    const direccioInput = document.querySelector('input[name="direccio"]') as HTMLInputElement;
    
    if (latInput) latInput.value = lat.toString();
    if (lngInput) lngInput.value = lng.toString();
    if (direccioInput && direccio) direccioInput.value = direccio;
    
    // Cercar el nom del restaurant automàticament
    cercarNomRestaurant(lat, lng);
  }

  async function cercarNomRestaurant(lat: number, lng: number) {
    setCarregantNom(true);
    
    try {
      // Usar OpenStreetMap Nominatim per obtenir informació del lloc
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=ca&extratags=1`
      );
      
      if (!response.ok) throw new Error('Error en la cerca');
      
      const data = await response.json();
      
      // Intentar extreure el nom del restaurant
      let nomRestaurant = '';
      
      // Prioritat 1: Nom del lloc (amenity, shop, etc.)
      if (data.extratags?.name) {
        nomRestaurant = data.extratags.name;
      } else if (data.namedetails?.name) {
        nomRestaurant = data.namedetails.name;
      } else if (data.display_name) {
        // Si no hi ha nom específic, agafar la primera part de la direcció
        const parts = data.display_name.split(',');
        // Buscar parts que semblin noms de negocis (no carrers ni números)
        for (const part of parts) {
          const trimmed = part.trim();
          // Evitar carrers (Carrer, Av., Plaça, etc.)
          if (!trimmed.match(/^(Carrer|C\/|Av|Avinguda|Pl|Plaça|Rbla|Rambla|Pg|Passeig|Ctra|Carretera)\s/i) &&
              trimmed.length > 2 &&
              !trimmed.match(/^\d+$/)) {
            nomRestaurant = trimmed;
            break;
          }
        }
      }
      
      // Si hem trobat un nom, omplir el camp
      if (nomRestaurant) {
        const nomInput = document.querySelector('input[name="nom"]') as HTMLInputElement;
        if (nomInput) {
          nomInput.value = nomRestaurant;
          // Animació visual per mostrar que s'ha omplert automàticament
          nomInput.classList.add('bg-green-50');
          setTimeout(() => nomInput.classList.remove('bg-green-50'), 2000);
        }
      }
      
      // També intentar extreure el barri i ciutat si no estan omplerts
      const barriInput = document.querySelector('input[name="barri"]') as HTMLInputElement;
      const ciutatInput = document.querySelector('input[name="ciutat"]') as HTMLInputElement;
      
      if (data.address) {
        const { suburb, neighbourhood, city, town, village, municipality } = data.address;
        
        if (barriInput && !barriInput.value) {
          const barri = suburb || neighbourhood || '';
          if (barri) barriInput.value = barri;
        }
        
        if (ciutatInput && !ciutatInput.value) {
          const ciutat = city || town || village || municipality || '';
          if (ciutat) ciutatInput.value = ciutat;
        }
      }
      
    } catch (error) {
      console.error('Error cercant nom del restaurant:', error);
    } finally {
      setCarregantNom(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Tornar al cercador
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Afegir Restaurant a SomDeMenjar</h1>
          <p className="text-gray-600 mt-2">
            Completa el formulari amb la informació del restaurant. Contrasenya requerida: <strong>GRANDIA</strong>
          </p>
        </div>

        {/* Missatge d'èxit o error */}
        {state.message && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              state.success
                ? 'bg-green-100 text-green-800 border border-green-200'
                : 'bg-red-100 text-red-800 border border-red-200'
            }`}
          >
            {state.message}
          </div>
        )}

        <form action={formAction} className="space-y-8">
          {/* Extreure coordenades de Google Maps */}
          <CoordenadesExtractor onCoordenadesTrobades={handleCoordenadesTrobades} />

          {/* Indicador de cerca de nom */}
          {carregantNom && (
            <div className="flex items-center gap-2 text-blue-600 bg-blue-50 p-3 rounded-lg">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">Cercant informació del restaurant...</span>
            </div>
          )}

          {/* Contrasenya */}
          <div className="card border-l-4 border-red-500">
            <div className="flex items-center gap-2 mb-4">
              <Lock className="w-5 h-5 text-red-600" />
              <h2 className="text-lg font-semibold">Contrasenya d'accés</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">Contrasenya *</label>
                <input
                  type={mostrarPassword ? 'text' : 'password'}
                  name="password"
                  required
                  className="input-field"
                  placeholder="Introdueix GRANDIA"
                />
                {state.errors?.password && (
                  <p className="text-red-600 text-sm mt-1">{state.errors.password[0]}</p>
                )}
              </div>
              <div className="flex items-end">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={mostrarPassword}
                    onChange={(e) => setMostrarPassword(e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm text-gray-600">Mostrar contrasenya</span>
                </label>
              </div>
            </div>
          </div>

          {/* Informació bàsica */}
          <div className="card">
            <div className="flex items-center gap-2 mb-4">
              <Info className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-semibold">Informació Bàsica</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="label">Nom del restaurant *</label>
                <input
                  type="text"
                  name="nom"
                  required
                  className="input-field transition-colors duration-500"
                  placeholder="Ex: Can Joan"
                />
                <p className="text-xs text-gray-500 mt-1">
                  💡 S'omplirà automàticament si extreus coordenades de Google Maps
                </p>
              </div>
              <div className="md:col-span-2">
                <label className="label">Direcció completa *</label>
                <input
                  type="text"
                  name="direccio"
                  required
                  className="input-field"
                  placeholder="Carrer, número, pis..."
                />
              </div>
              <div>
                <label className="label">Barri *</label>
                <input
                  type="text"
                  name="barri"
                  required
                  className="input-field"
                  placeholder="Ex: Gràcia"
                />
              </div>
              <div>
                <label className="label">Ciutat *</label>
                <input
                  type="text"
                  name="ciutat"
                  required
                  className="input-field"
                  placeholder="Ex: Barcelona"
                />
              </div>
              <div>
                <label className="label">Latitud *</label>
                <input
                  type="number"
                  name="lat"
                  step="any"
                  required
                  className="input-field"
                  placeholder="41.3851"
                />
              </div>
              <div>
                <label className="label">Longitud *</label>
                <input
                  type="number"
                  name="lng"
                  step="any"
                  required
                  className="input-field"
                  placeholder="2.1734"
                />
              </div>
            </div>
          </div>

          {/* Característiques */}
          <div className="card">
            <div className="flex items-center gap-2 mb-4">
              <Euro className="w-5 h-5 text-green-600" />
              <h2 className="text-lg font-semibold">Característiques</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">Preu mitjà per persona (€) *</label>
                <input
                  type="number"
                  name="preuMig"
                  step="0.01"
                  min="0"
                  required
                  className="input-field"
                  placeholder="25.00"
                />
              </div>
              <div>
                <label className="label">Tipus de cuina *</label>
                <select name="tipusCuina" required className="input-field">
                  <option value="">Selecciona...</option>
                  {TIPUS_CUINA_OPTIONS.map((opcio) => (
                    <option key={opcio.value} value={opcio.value}>
                      {opcio.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="label">Tipus d'àpat disponible (selecciona múltiples)</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                  {TIPUS_APAT_OPTIONS.map((opcio) => (
                    <label key={opcio.value} className="flex items-center gap-2 p-2 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="checkbox"
                        name="tipusApats"
                        value={opcio.value}
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm">{opcio.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Puntuacions */}
          <div className="card">
            <div className="flex items-center gap-2 mb-4">
              <Star className="w-5 h-5 text-yellow-500" />
              <h2 className="text-lg font-semibold">Puntuacions (0-5)</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Object.entries(PUNTUACIO_LABELS).map(([key, label]) => (
                <div key={key}>
                  <label className="label">{label}</label>
                  <input
                    type="number"
                    name={key}
                    min="0"
                    max="5"
                    defaultValue="0"
                    className="input-field"
                  />
                  <input
                    type="range"
                    min="0"
                    max="5"
                    defaultValue="0"
                    className="range-slider mt-2"
                    onChange={(e) => {
                      const input = document.querySelector(`input[name="${key}"]`) as HTMLInputElement;
                      if (input) input.value = e.target.value;
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Contacte i notes */}
          <div className="card">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-5 h-5 text-purple-600" />
              <h2 className="text-lg font-semibold">Contacte i Notes</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">Telèfon</label>
                <input
                  type="tel"
                  name="telefon"
                  className="input-field"
                  placeholder="+34 123 456 789"
                />
              </div>
              <div>
                <label className="label">Pàgina web</label>
                <input
                  type="url"
                  name="web"
                  className="input-field"
                  placeholder="https://..."
                />
              </div>
              <div>
                <label className="label">Instagram</label>
                <input
                  type="text"
                  name="instagram"
                  className="input-field"
                  placeholder="@nomdelcompte"
                />
              </div>
              <div>
                <label className="label">Afegit per</label>
                <input
                  type="text"
                  name="afegitPer"
                  className="input-field"
                  placeholder="El teu nom (opcional)"
                />
              </div>
              <div className="md:col-span-2">
                <label className="label">Notes / Comentaris</label>
                <textarea
                  name="notes"
                  rows={3}
                  className="input-field"
                  placeholder="Recomanacions especials, plats destacats, etc."
                />
              </div>
            </div>
          </div>

          {/* Botó submit */}
          <div className="flex justify-end">
            <SubmitButton />
          </div>
        </form>
      </div>
    </div>
  );
}
