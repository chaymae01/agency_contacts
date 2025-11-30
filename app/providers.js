'use client';

import { ClerkProvider } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { frFR } from '@clerk/localizations';

export function Providers({ children }) {
  const router = useRouter();
  
  return (
    <ClerkProvider
      localization={frFR}
      routerPush={(path) => router.push(path)}
      routerReplace={(path) => router.replace(path)}
    >
      {children}
    </ClerkProvider>
  );
}