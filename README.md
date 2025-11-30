

# Agency Contacts Dashboard

## ▶️ Run Locally

1. Clone the project:

git clone https://github.com/chaymae01/agency_contacts
cd agency_contacts
````

2. Install dependencies:


npm install
```

3. Create a `.env` file with your environment variables:

```
DATABASE_URL=postgresql://...
CLERK_SECRET_KEY=...
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...
```

➡️ **The project uses a PostgreSQL database hosted on Railway.**

4. Sync the database:


npx prisma db push
npm run db:seed

5. Start the development server:


npm run dev
```

➡️ App will run at: [http://localhost:3000](http://localhost:3000)

---

## 🌐 Deployment

The application is deployed on **Vercel** and connected to **PostgreSQL (Railway)**.

```

  

Just tell me!
```
