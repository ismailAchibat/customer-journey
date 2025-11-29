'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { I18nProvider } from './context/i18n';

export function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      <I18nProvider>
        {children}
      </I18nProvider>
    </QueryClientProvider>
  );
}