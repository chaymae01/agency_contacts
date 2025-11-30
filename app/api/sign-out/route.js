import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

export async function POST() {
  try {
    const { sessionId } = await auth();
    
    if (sessionId) {
      await fetch(`https://api.clerk.com/v1/sessions/${sessionId}/revoke`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('❌ Erreur déconnexion:', error);
    return NextResponse.json(
      { error: 'Erreur déconnexion' },
      { status: 500 }
    );
  }
}