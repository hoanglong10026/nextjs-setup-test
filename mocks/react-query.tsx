import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Disable retries
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});

// Wrapper component to provide query client
export const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);
export default queryClient;
