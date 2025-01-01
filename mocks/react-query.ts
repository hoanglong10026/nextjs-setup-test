import { QueryClient } from '@tanstack/react-query';

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

export default queryClient;