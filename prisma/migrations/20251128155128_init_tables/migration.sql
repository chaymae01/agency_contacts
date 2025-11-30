-- CreateTable
CREATE TABLE "agencies_agency_rows" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "state" TEXT,
    "state_code" TEXT,
    "type" TEXT,
    "population" INTEGER,
    "website" TEXT,
    "total_schools" INTEGER,
    "total_students" INTEGER,
    "mailing_address" TEXT,
    "grade_span" TEXT,
    "locale" TEXT,
    "csa_cbsa" TEXT,
    "domain_name" TEXT,
    "physical_address" TEXT,
    "phone" TEXT,
    "status" TEXT,
    "student_teacher_ratio" DECIMAL(65,30),
    "supervisory_union" TEXT,
    "county" TEXT,
    "created_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "agencies_agency_rows_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contacts_contact_rows" (
    "id" TEXT NOT NULL,
    "first_name" TEXT,
    "last_name" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "title" TEXT,
    "email_type" TEXT,
    "contact_form_url" TEXT,
    "created_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3),
    "department" TEXT,
    "agency_id" TEXT,
    "firm_id" TEXT,

    CONSTRAINT "contacts_contact_rows_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "contacts_contact_rows" ADD CONSTRAINT "contacts_contact_rows_agency_id_fkey" FOREIGN KEY ("agency_id") REFERENCES "agencies_agency_rows"("id") ON DELETE SET NULL ON UPDATE CASCADE;
