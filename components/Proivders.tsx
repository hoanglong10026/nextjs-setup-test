'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PropsWithChildren, useState } from 'react';

const Providers = ({ children }: PropsWithChildren) => {
  const [client] = useState(
    new QueryClient({
      defaultOptions: {
        queries: {
          // Disable retries
          retry: false,
        },
        mutations: {
          retry: false,
        },
      },
    })
  );
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
};

export default Providers;
