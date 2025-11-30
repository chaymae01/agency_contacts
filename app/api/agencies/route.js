import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const user = await currentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    // Vérifier que l'utilisateur existe dans notre base de données
    const dbUser = await prisma.user.findUnique({
      where: { clerkId: user.id },
    });

    if (!dbUser) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    }

    // Récupérer toutes les agences avec TOUS les champs
    const agencies = await prisma.agencies_agency_rows.findMany({
      orderBy: {
        name: 'asc',
      },
    });

    console.log(`📊 ${agencies.length} agences récupérées pour l'utilisateur: ${dbUser.email}`);

    return NextResponse.json({
      agencies,
      count: agencies.length,
    });
  } catch (error) {
    console.error('❌ Erreur API agencies:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}