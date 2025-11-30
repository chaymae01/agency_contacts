import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST() {
  try {
    const user = await currentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { clerkId: user.id },
    });

    if (!dbUser) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    }

    // Réinitialiser le compteur ET la liste des contacts vus
    const updatedUser = await prisma.user.update({
      where: { id: dbUser.id },
      data: {
        dailyViews: 0,
        viewedContacts: [], // Vider la liste des contacts vus
        lastViewDate: new Date(),
      },
    });

    console.log(`🔄 Limite réinitialisée pour l'utilisateur: ${dbUser.email}`);

    return NextResponse.json({
      success: true,
      message: 'Félicitations ! Vous avez maintenant un accès illimité aux contacts.',
      user: updatedUser,
    });
  } catch (error) {
    console.error('❌ Erreur reset limit:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}