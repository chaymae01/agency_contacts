const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse');

const prisma = new PrismaClient();

// Chemins vers les fichiers CSV
const AGENCIES_CSV_PATH = path.join(__dirname, '..', 'data', 'agencies_agency_rows.csv');
const CONTACTS_CSV_PATH = path.join(__dirname, '..', 'data', 'contacts_contact_rows.csv');

// Fonction utilitaire pour vérifier si une chaîne est un UUID valide
const isUUID = (uuid) => {
    const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return regex.test(uuid);
};

// Fonction pour convertir une chaîne en Date (gère les valeurs vides)
const parseDate = (dateString) => {
    if (!dateString || dateString.trim() === '' || dateString === 'NULL') {
        return undefined;
    }
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? undefined : date;
};

// Fonction pour convertir en nombre (gère les valeurs vides)
const parseNumber = (numString) => {
    if (!numString || numString.trim() === '' || numString === 'NULL') {
        return null;
    }
    const num = parseFloat(numString);
    return isNaN(num) ? null : num;
};

// Fonction pour lire et parser un fichier CSV AVEC en-têtes
const parseCSV = (filePath) => {
    return new Promise((resolve, reject) => {
        const records = [];
        const parser = parse({
            delimiter: ',',
            columns: true, // Utiliser la première ligne comme en-têtes
            skip_empty_lines: true,
            trim: true,
        });

        fs.createReadStream(filePath)
            .pipe(parser)
            .on('data', (record) => {
                records.push(record);
            })
            .on('end', () => {
                console.log(`✅ ${records.length} lignes lues depuis ${path.basename(filePath)}`);
                resolve(records);
            })
            .on('error', (err) => {
                console.error(`❌ Erreur de lecture du fichier ${filePath}:`, err);
                reject(err);
            });
    });
};

// Fonction principale de seeding
async function main() {
    console.log('🚀 Démarrage du seeding...');

    try {
        // Test de connexion à la base de données
        await prisma.$connect();
        console.log('✅ Connexion à la base de données réussie');

        // 1. Importation des Agences
        console.log('📖 Lecture et importation des agences...');
        
        if (!fs.existsSync(AGENCIES_CSV_PATH)) {
            throw new Error(`Fichier non trouvé: ${AGENCIES_CSV_PATH}`);
        }

        const agencyRecords = await parseCSV(AGENCIES_CSV_PATH);
        let agenciesCount = 0;
        let agenciesErrors = 0;

        for (const record of agencyRecords) {
            try {
                // Mapping correct des colonnes basé sur votre schéma Prisma
                await prisma.agencies_agency_rows.upsert({
                    where: { id: record.id },
                    update: {},
                    create: {
                        id: record.id,
                        name: record.name || '',
                        state: record.state || null,
                        state_code: record.state_code || null,
                        type: record.type || null,
                        population: parseNumber(record.population),
                        website: record.website || null,
                        total_schools: parseNumber(record.total_schools),
                        total_students: parseNumber(record.total_students),
                        mailing_address: record.mailing_address || null,
                        grade_span: record.grade_span || null,
                        locale: record.locale || null,
                        csa_cbsa: record.csa_cbsa || null,
                        domain_name: record.domain_name || null,
                        physical_address: record.physical_address || null,
                        phone: record.phone || null,
                        status: record.status || null,
                        student_teacher_ratio: parseNumber(record.student_teacher_ratio),
                        supervisory_union: record.supervisory_union || null,
                        county: record.county || null,
                        created_at: parseDate(record.created_at),
                        updated_at: parseDate(record.updated_at),
                    },
                });
                agenciesCount++;
                
                // Afficher la progression
                if (agenciesCount % 100 === 0) {
                    console.log(`📊 ${agenciesCount} agences traitées...`);
                }
            } catch (e) {
                agenciesErrors++;
                console.error(`❌ Erreur avec l'agence ID ${record.id}:`, e.message);
                // Continuer avec les autres enregistrements
            }
        }
        console.log(`✅ Importation des agences terminée. ${agenciesCount} agences insérées, ${agenciesErrors} erreurs.`);

        // 2. Importation des Contacts
        console.log('📖 Lecture et importation des contacts...');
        
        if (!fs.existsSync(CONTACTS_CSV_PATH)) {
            throw new Error(`Fichier non trouvé: ${CONTACTS_CSV_PATH}`);
        }

        const contactRecords = await parseCSV(CONTACTS_CSV_PATH);
        let contactsCount = 0;
        let contactsErrors = 0;

        for (const record of contactRecords) {
            try {
                // Gestion de agency_id
                let finalAgencyId = null;
                if (record.agency_id && isUUID(record.agency_id)) {
                    // Vérifier si l'agence existe
                    const existingAgency = await prisma.agencies_agency_rows.findUnique({
                        where: { id: record.agency_id },
                        select: { id: true }
                    });
                    if (existingAgency) {
                        finalAgencyId = record.agency_id;
                    }
                }

                await prisma.contacts_contact_rows.upsert({
                    where: { id: record.id },
                    update: {},
                    create: {
                        id: record.id,
                        first_name: record.first_name || null,
                        last_name: record.last_name || null,
                        email: record.email || null,
                        phone: record.phone || null,
                        title: record.title || null,
                        email_type: record.email_type || null,
                        contact_form_url: record.contact_form_url || null,
                        department: record.department || null,
                        agency_id: finalAgencyId,
                        firm_id: record.firm_id || null,
                        created_at: parseDate(record.created_at),
                        updated_at: parseDate(record.updated_at),
                    },
                });
                contactsCount++;
                
                // Afficher la progression
                if (contactsCount % 100 === 0) {
                    console.log(`📊 ${contactsCount} contacts traités...`);
                }
            } catch (e) {
                contactsErrors++;
                console.error(`❌ Erreur avec le contact ID ${record.id}:`, e.message);
                // Continuer avec les autres enregistrements
            }
        }
        console.log(`✅ Importation des contacts terminée. ${contactsCount} contacts insérés, ${contactsErrors} erreurs.`);

        console.log('🎉 Seeding terminé avec succès!');

    } catch (error) {
        console.error('💥 Erreur critique:', error);
        throw error;
    }
}

main()
    .catch((e) => {
        console.error('❌ Échec du seeding:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });