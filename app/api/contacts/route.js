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

    // Vérifier la limite quotidienne
    const today = new Date();
    if (dbUser.lastViewDate) {
      const lastViewDate = new Date(dbUser.lastViewDate);
      if (lastViewDate.toDateString() !== today.toDateString()) {
        // Réinitialiser le compteur si c'est un nouveau jour
        await prisma.user.update({
          where: { id: dbUser.id },
          data: {
            dailyViews: 0,
            lastViewDate: today,
          },
        });
      }
    }

    // Si la limite est atteinte, retourner une erreur
    if (dbUser.dailyViews >= 50) {
      return NextResponse.json(
        { error: 'Limite quotidienne de 50 contacts atteinte' },
        { status: 429 }
      );
    }

    // Récupérer tous les contacts
    const contacts = await prisma.contacts_contact_rows.findMany({
      include: {
        agency: {
          select: {
            name: true,
            state: true,
          },
        },
      },
      orderBy: {
        first_name: 'asc',
      },
    });

    console.log(`📞 ${contacts.length} contacts récupérés pour l'utilisateur: ${dbUser.email}`);

    return NextResponse.json({
      contacts,
      count: contacts.length,
      dailyViews: dbUser.dailyViews,
      limit: 50,
    });
  } catch (error) {
    console.error('❌ Erreur API contacts:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}