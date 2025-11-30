import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const user = await currentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const { contactId } = await request.json();

    if (!contactId) {
      return NextResponse.json({ error: 'ID contact manquant' }, { status: 400 });
    }

    // Vérifier que l'utilisateur existe dans notre base de données
    let dbUser = await prisma.user.findUnique({
      where: { clerkId: user.id },
    });

    if (!dbUser) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    }

    // Vérifier et réinitialiser le compteur si nécessaire
    const today = new Date();
    if (dbUser.lastViewDate) {
      const lastViewDate = new Date(dbUser.lastViewDate);
      if (lastViewDate.toDateString() !== today.toDateString()) {
        dbUser = await prisma.user.update({
          where: { id: dbUser.id },
          data: {
            dailyViews: 0,
            viewedContacts: [], // Réinitialiser la liste des contacts vus
            lastViewDate: today,
          },
        });
      }
    }

    // Vérifier si le contact a déjà été vu aujourd'hui
    const viewedContacts = dbUser.viewedContacts || [];
    const hasAlreadyViewed = viewedContacts.includes(contactId);

    // Vérifier la limite quotidienne seulement pour les nouveaux contacts
    if (!hasAlreadyViewed && dbUser.dailyViews >= 50) {
      return NextResponse.json(
        { error: 'Limite quotidienne de 50 contacts atteinte' },
        { status: 429 }
      );
    }

    let updatedUser = dbUser;
    let isNewView = false;

    // Incrémenter le compteur seulement si c'est un nouveau contact
    if (!hasAlreadyViewed) {
      updatedUser = await prisma.user.update({
        where: { id: dbUser.id },
        data: {
          dailyViews: {
            increment: 1,
          },
          viewedContacts: {
            push: contactId, // Ajouter le contact à la liste des vus
          },
          lastViewDate: today,
        },
      });
      isNewView = true;
    }

    // Récupérer TOUS les détails du contact avec tous les champs
    const contact = await prisma.contacts_contact_rows.findUnique({
      where: { id: contactId },
      include: {
        agency: {
          select: {
            id: true,
            name: true,
            state: true,
            state_code: true,
            type: true,
            population: true,
            website: true,
            total_schools: true,
            total_students: true,
            mailing_address: true,
            grade_span: true,
            locale: true,
            csa_cbsa: true,
            domain_name: true,
            physical_address: true,
            phone: true,
            status: true,
            student_teacher_ratio: true,
            supervisory_union: true,
            county: true,
            created_at: true,
            updated_at: true,
          },
        },
      },
    });

    if (!contact) {
      return NextResponse.json({ error: 'Contact non trouvé' }, { status: 404 });
    }

    console.log(`👁️ Contact consulté par ${dbUser.email}: ${contact.first_name} ${contact.last_name} (${hasAlreadyViewed ? 'déjà vu' : 'nouveau'})`);

    return NextResponse.json({
      contact: {
        // Tous les champs du contact
        id: contact.id,
        first_name: contact.first_name,
        last_name: contact.last_name,
        email: contact.email,
        phone: contact.phone,
        title: contact.title,
        email_type: contact.email_type,
        contact_form_url: contact.contact_form_url,
        department: contact.department,
        agency_id: contact.agency_id,
        firm_id: contact.firm_id,
        created_at: contact.created_at,
        updated_at: contact.updated_at,
        // Tous les champs de l'agence
        agency: contact.agency ? {
          id: contact.agency.id,
          name: contact.agency.name,
          state: contact.agency.state,
          state_code: contact.agency.state_code,
          type: contact.agency.type,
          population: contact.agency.population,
          website: contact.agency.website,
          total_schools: contact.agency.total_schools,
          total_students: contact.agency.total_students,
          mailing_address: contact.agency.mailing_address,
          grade_span: contact.agency.grade_span,
          locale: contact.agency.locale,
          csa_cbsa: contact.agency.csa_cbsa,
          domain_name: contact.agency.domain_name,
          physical_address: contact.agency.physical_address,
          phone: contact.agency.phone,
          status: contact.agency.status,
          student_teacher_ratio: contact.agency.student_teacher_ratio,
          supervisory_union: contact.agency.supervisory_union,
          county: contact.agency.county,
          created_at: contact.agency.created_at,
          updated_at: contact.agency.updated_at,
        } : null
      },
      user: updatedUser,
      isNewView: isNewView,
      message: hasAlreadyViewed 
        ? `Contact déjà consulté aujourd'hui. Vous avez consulté ${updatedUser.dailyViews}/50 contacts.`
        : `Consultation comptabilisée. Vous avez consulté ${updatedUser.dailyViews}/50 contacts aujourd'hui.`,
    });
  } catch (error) {
    console.error('❌ Erreur API view contact:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}