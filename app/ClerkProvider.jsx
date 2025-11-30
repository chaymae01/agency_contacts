'use client';

import { ClerkProvider as BaseClerkProvider } from '@clerk/nextjs';
import { frFR } from '@clerk/localizations';

export function ClerkProvider({ children }) {
  return (
    <BaseClerkProvider 
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
      localization={frFR}
    >
      {children}
    </BaseClerkProvider>
  );
}