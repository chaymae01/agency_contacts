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

    console.log('🔍 Recherche utilisateur:', user.id);

    let dbUser = await prisma.user.findUnique({
      where: { clerkId: user.id },
    });

    if (!dbUser) {
      dbUser = await prisma.user.create({
        data: {
          clerkId: user.id,
          email: user.emailAddresses[0]?.emailAddress || 'email@manquant.com',
          fullName: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Utilisateur',
          dailyViews: 0,
          lastViewDate: new Date(),
        },
      });
      console.log('✅ NOUVEL UTILISATEUR CRÉÉ:', dbUser);
    }

    const today = new Date();
    if (dbUser.lastViewDate) {
      const lastViewDate = new Date(dbUser.lastViewDate);
      if (lastViewDate.toDateString() !== today.toDateString()) {
        dbUser = await prisma.user.update({
          where: { id: dbUser.id },
          data: {
            dailyViews: 0,
            lastViewDate: today,
          },
        });
        console.log('🔄 Compteur réinitialisé pour:', dbUser.email);
      }
    }

    return NextResponse.json(dbUser);
  } catch (error) {
    console.error('❌ Erreur API user:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}