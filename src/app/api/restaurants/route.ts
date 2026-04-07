import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Construir filtres dinàmicament
    const where: any = {};

    // Filtre per query (nom, direcció, barri)
    const query = searchParams.get('query');
    if (query) {
      where.OR = [
        { nom: { contains: query, mode: 'insensitive' } },
        { direccio: { contains: query, mode: 'insensitive' } },
        { barri: { contains: query, mode: 'insensitive' } },
      ];
    }

    // Filtre per ciutat
    const ciutat = searchParams.get('ciutat');
    if (ciutat) {
      where.ciutat = { equals: ciutat, mode: 'insensitive' };
    }

    // Filtre per barri
    const barri = searchParams.get('barri');
    if (barri) {
      where.barri = { contains: barri, mode: 'insensitive' };
    }

    // Filtre per tipus de cuina (pot ser múltiple)
    const tipusCuina = searchParams.getAll('tipusCuina');
    if (tipusCuina.length > 0) {
      where.tipusCuina = { in: tipusCuina };
    }

    // Filtre per tipus d'àpat (array contains)
    const tipusApats = searchParams.getAll('tipusApats');
    if (tipusApats.length > 0) {
      where.tipusApats = { hasSome: tipusApats };
    }

    // Filtre per rang de preu
    const preuMin = searchParams.get('preuMin');
    const preuMax = searchParams.get('preuMax');
    if (preuMin || preuMax) {
      where.preuMig = {};
      if (preuMin) where.preuMig.gte = parseFloat(preuMin);
      if (preuMax) where.preuMig.lte = parseFloat(preuMax);
    }

    // Filtre per puntuació mínima (calculat a posteriori, però podem filtrar per camps individuals)
    const puntuacioMinima = searchParams.get('puntuacioMinima');

    const restaurants = await prisma.restaurant.findMany({
      where,
      orderBy: {
        dataAddicio: 'desc',
      },
    });

    // Filtrar per puntuació global si es necessari
    let resultats = restaurants;
    if (puntuacioMinima) {
      const min = parseFloat(puntuacioMinima);
      resultats = restaurants.filter((r) => {
        const global = (
          r.puntuacioMenjar +
          r.puntuacioAmbient +
          r.puntuacioServei +
          r.puntuacioQualitatPreu +
          r.puntuacioOriginalitat +
          r.puntuacioSostenibilitat +
          r.puntuacioAccessibilitat +
          r.puntuacioTerrassa +
          r.puntuacioCartaVins +
          r.puntuacioRapidesa
        ) / 10;
        return global >= min;
      });
    }

    return NextResponse.json(resultats);
  } catch (error) {
    console.error('Error en GET /api/restaurants:', error);
    return NextResponse.json(
      { error: 'Error intern del servidor' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Verificar contrasenya
    const password = body.password;
    if (password !== process.env.ADD_PASSWORD) {
      return NextResponse.json(
        { error: 'Contrasenya incorrecta' },
        { status: 401 }
      );
    }

    // Eliminar password del body abans de crear
    delete body.password;

    const restaurant = await prisma.restaurant.create({
      data: body,
    });

    return NextResponse.json(restaurant, { status: 201 });
  } catch (error) {
    console.error('Error en POST /api/restaurants:', error);
    return NextResponse.json(
      { error: 'Error creant el restaurant' },
      { status: 500 }
    );
  }
}
