import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const payload = await request.json();
    
    // Vérifier le type d'événement
    if (payload.type === 'user.created') {
      const userData = payload.data;
      
      // Créer l'utilisateur dans votre base de données
      await prisma.user.create({
        data: {
          clerkId: userData.id,
          email: userData.email_addresses[0]?.email_address || 'email@manquant.com',
          fullName: `${userData.first_name || ''} ${userData.last_name || ''}`.trim() || null,
          dailyViews: 0,
          lastViewDate: new Date(),
        },
      });
      
      console.log('✅ Utilisateur créé via webhook:', userData.id);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('❌ Erreur webhook Clerk:', error);
    return NextResponse.json(
      { error: 'Erreur webhook' },
      { status: 500 }
    );
  }
}