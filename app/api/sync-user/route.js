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

    const userEmail = user.emailAddresses[0]?.emailAddress || 'email@manquant.com';
    const userFullName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || null;

    const dbUser = await prisma.user.upsert({
      where: { clerkId: user.id },
      update: {
        email: userEmail,
        fullName: userFullName,
      },
      create: {
        clerkId: user.id,
        email: userEmail,
        fullName: userFullName,
        dailyViews: 0,
        lastViewDate: new Date(),
      },
    });

    console.log('✅ Utilisateur synchronisé:', dbUser.email);

    return NextResponse.json({ 
      success: true, 
      user: dbUser 
    });
  } catch (error) {
    console.error('❌ Erreur sync user:', error);
    return NextResponse.json(
      { error: 'Erreur synchronisation' },
      { status: 500 }
    );
  }
}