import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const restaurant = await prisma.restaurant.findUnique({
      where: { id: params.id },
    });

    if (!restaurant) {
      return NextResponse.json(
        { error: 'Restaurant no trobat' },
        { status: 404 }
      );
    }

    return NextResponse.json(restaurant);
  } catch (error) {
    console.error('Error en GET /api/restaurants/[id]:', error);
    return NextResponse.json(
      { error: 'Error intern del servidor' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const password = searchParams.get('password');

    if (password !== process.env.ADD_PASSWORD) {
      return NextResponse.json(
        { error: 'Contrasenya incorrecta' },
        { status: 401 }
      );
    }

    await prisma.restaurant.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Restaurant eliminat correctament' });
  } catch (error) {
    console.error('Error en DELETE /api/restaurants/[id]:', error);
    return NextResponse.json(
      { error: 'Error eliminant el restaurant' },
      { status: 500 }
    );
  }
}
