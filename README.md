# RestaurantDB 🍽️

Base de dades de restaurants amb sistema de valoracions multicitèria. Aplicació desenvolupada amb Next.js 14, Prisma i PostgreSQL.

## Característiques

- 🔍 **Cerca avançada** per ubicació, preu, tipus de cuina i àpat
- ⭐ **Sistema de valoracions** amb 10 criteris (0-5)
- 📍 **Geolocalització** amb cerca per distància
- 🌐 **Interfície 100% en català**
- 🔐 **Accés protegit** per afegir restaurants (password: GRANDIA)
- 📱 **Disseny responsive**

## Tecnologies

- **Framework:** Next.js 14 (App Router)
- **Llenguatge:** TypeScript
- **Base de dades:** PostgreSQL (Vercel Postgres)
- **ORM:** Prisma
- **Estils:** Tailwind CSS
- **Icones:** Lucide React

## Requisits previs

1. Node.js 18+
2. Compte a Vercel (per desplegament)
3. Base de dades PostgreSQL (Vercel Postgres recomanat)

## Instal·lació local

### 1. Clonar i instal·lar dependències

```bash
git clone <url-del-teu-repositori>
cd restaurants-app
npm install
```

### 2. Configurar variables d'entorn

Copia `.env.example` a `.env.local`:

```bash
cp .env.example .env.local
```

Edita `.env.local`:

```env
# Base de dades PostgreSQL
DATABASE_URL="postgresql://user:password@localhost:5432/restaurants_db"

# Password per afegir restaurants (canvia-ho per seguretat!)
ADD_PASSWORD="GRANDIA"

# URL de l'app (per a metadades)
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3. Configurar base de dades

```bash
# Generar client Prisma
npx prisma generate

# Crear taules (amb Prisma db push - no requereix migracions)
npx prisma db push

# (Opcional) Obrir Prisma Studio per gestionar dades
npx prisma studio
```

### 4. Executar en desenvolupament

```bash
npm run dev
```

L'app estarà disponible a `http://localhost:3000`

## Estructura del projecte

```
restaurants-app/
├── prisma/
│   └── schema.prisma          # Esquema de base de dades
├── src/
│   ├── app/
│   │   ├── actions.ts         # Server Actions
│   │   ├── api/
│   │   │   └── restaurants/
│   │   │       ├── route.ts   # API GET/POST
│   │   │       └── [id]/
│   │   │           └── route.ts # API GET/DELETE individual
│   │   ├── afegir/
│   │   │   └── page.tsx       # Formulari nou restaurant
│   │   ├── restaurant/
│   │   │   └── [id]/
│   │   │       └── page.tsx   # Pàgina detall
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx           # Pàgina principal (cercador)
│   ├── components/
│   │   ├── FiltresPanel.tsx   # Panel de filtres
│   │   └── RestaurantCard.tsx # Targeta restaurant
│   ├── lib/
│   │   ├── prisma.ts          # Client Prisma
│   │   └── utils.ts           # Utilitats
│   └── types/
│       └── index.ts           # Tipus TypeScript
├── .env.example
├── next.config.js
├── package.json
├── postcss.config.js
├── tailwind.config.ts
└── tsconfig.json
```

## Model de dades

### Restaurant

| Camp | Tipus | Descripció |
|------|-------|------------|
| id | UUID | Identificador únic |
| nom | String | Nom del restaurant |
| direccio | String | Direcció completa |
| lat, lng | Float | Coordenades GPS |
| barri | String | Barri |
| ciutat | String | Ciutat |
| preuMig | Float | Preu mitjà per persona (€) |
| tipusCuina | Enum | Tipus de cuina (14 opcions) |
| tipusApats | Enum[] | Tipus d'àpat disponible |
| puntuacioMenjar | Int | Qualitat del menjar (0-5) |
| puntuacioAmbient | Int | Decoració, confort (0-5) |
| puntuacioServei | Int | Atenció al client (0-5) |
| puntuacioQualitatPreu | Int | Relació qualitat-preu (0-5) |
| puntuacioOriginalitat | Int | Creativitat (0-5) |
| puntuacioSostenibilitat | Int | Producte local/eco (0-5) |
| puntuacioAccessibilitat | Int | Accessible PMR (0-5) |
| puntuacioTerrassa | Int | Qualitat terrassa (0-5) |
| puntuacioCartaVins | Int | Selecció de vins (0-5) |
| puntuacioRapidesa | Int | Temps d'espera (0-5) |
| notes | String? | Comentaris addicionals |
| telefon | String? | Telèfon de contacte |
| web | String? | Pàgina web |
| instagram | String? | Compte d'Instagram |
| dataAddicio | DateTime | Data de creació |
| afegitPer | String | Nom de qui ho va afegir |

## Desplegament a Vercel

### 1. Preparar el projecte

Assegura't que tens al `next.config.js`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
}

module.exports = nextConfig
```

### 2. Crear projecte a Vercel

```bash
# Instalar Vercel CLI si no el tens
npm i -g vercel

# Login i desplegament
vercel login
vercel
```

O desplega directament des del repositori de GitHub connectant-lo a Vercel.

### 3. Configurar variables d'entorn a Vercel

A la consola de Vercel, ves a **Settings > Environment Variables** i afegeix:

- `DATABASE_URL`: URL de connexió PostgreSQL (Vercel Postgres o externa)
- `ADD_PASSWORD`: GRANDIA (o la que prefereixis)
- `NEXT_PUBLIC_APP_URL`: URL de la teva app (ex: https://restaurants-db.vercel.app)

### 4. Configurar Vercel Postgres (opcional però recomanat)

1. A la consola de Vercel, ves a la teva app → **Storage**
2. Clica **Create Database** → **Postgres**
3. Selecciona la regió (ha de coincidir amb la de la teva app)
4. Connecta la base de dades al projecte
5. Copia la `DATABASE_URL` que et proporcionen a les variables d'entorn

### 5. Executar migració inicial

Un cop desplegat, executa:

```bash
# Si uses Vercel Postgres des de local amb la URL de producció:
DATABASE_URL="<teva-url-de-produccio>" npx prisma db push
```

## Ús de l'aplicació

### Afegir un restaurant

1. Clica el botó **"Afegir restaurant"**
2. Introdueix la contrasenya: **GRANDIA**
3. Completa tots els camps obligatoris (marcats amb *)
4. Per les coordenades GPS, pots usar Google Maps (clic dret → "Què hi ha aquí?")
5. Assigna puntuacions de 0 a 5 per cada criteri
6. Clica **"Afegir Restaurant"**

### Cercar restaurants

- **Cerca per text:** Nom, direcció o barri
- **Filtres:** Clica "Filtres" per mostrar opcions avançades
  - Ubicació: Ciutat, barri, distància (requereix geolocalització)
  - Preu: Rang mínim i màxim
  - Tipus de cuina: Selecció múltiple
  - Tipus d'àpat: Esmorzar, dinar, sopar, brunch, vermut, tapes
  - Puntuació: Mínim global
- **Ordenació:** Per puntuació, distància, preu o nom

## API Endpoints

### GET /api/restaurants
Retorna tots els restaurants amb filtres opcionals (query params).

**Paràmetres opcionals:**
- `query`: Cerca per nom/direcció/barri
- `ciutat`: Filtra per ciutat exacta
- `barri`: Cerca per barri (parcial)
- `tipusCuina`: Array de tipus de cuina
- `tipusApats`: Array de tipus d'àpat
- `preuMin`, `preuMax`: Rang de preu
- `puntuacioMinima`: Puntuació global mínima (0-5)

### POST /api/restaurants
Crea un nou restaurant.

**Body requerit:**
```json
{
  "password": "GRANDIA",
  "nom": "Nom del restaurant",
  "direccio": "Carrer Exemple 123",
  "lat": 41.3851,
  "lng": 2.1734,
  "barri": "Gràcia",
  "ciutat": "Barcelona",
  "preuMig": 25.50,
  "tipusCuina": "CATALANA",
  "tipusApats": ["DINAR", "SOPAR"],
  "puntuacioMenjar": 4,
  "puntuacioAmbient": 3,
  ...
}
```

### GET /api/restaurants/[id]
Retorna un restaurant específic.

### DELETE /api/restaurants/[id]?password=GRANDIA
Elimina un restaurant (requereix contrasenya).

## Personalització

### Canviar la contrasenya

Edita la variable d'entorn `ADD_PASSWORD` i redesprega.

### Modificar tipus de cuina o àpats

Edita els enums a `prisma/schema.prisma` i executa `npx prisma db push`.

### Afegir més criteris de valoració

1. Afegeix el camp a `prisma/schema.prisma`
2. Executa `npx prisma db push`
3. Afegeix el label a `src/types/index.ts` (PUNTUACIO_LABELS)
4. Actualitza el formulari a `src/app/afegir/page.tsx`
5. Actualitza els càlculs a `src/lib/utils.ts` (calcularPuntuacioGlobal)

## Contribucions

Les contribucions són benvingudes! Si vols afegir funcionalitats com:
- Upload de fotos
- Sistema de comentaris
- Favorits per usuari
- Integració amb Google Maps
- App mòbil (React Native)

No dubtis en obrir un PR!

## Llicència

MIT License - Fes el que vulguis amb aquest codi! 😊

## Suport

Si tens problemes o preguntes:
1. Revisa que la `DATABASE_URL` sigui correcta
2. Verifica que `npx prisma generate` s'hagi executat
3. Assegura't que la base de dades PostgreSQL estigui accessible
4. Consulta els logs de Vercel si estàs desplegat

---

Fet amb ❤️ per als amants de la bona cuina catalana (i internacional!)
