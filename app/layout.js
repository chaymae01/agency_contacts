import { Inter } from 'next/font/google';
import { ClerkProvider } from './ClerkProvider';
import './globals.css';
export const dynamic = 'force-dynamic';
const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Dashboard Gestion Contacts',
  description: 'Application de gestion des contacts et agences',
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <ClerkProvider>
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}