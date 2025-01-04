import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { NextIntlClientProvider } from 'next-intl'
import messages from '@/messages/en.json'
import { ThemeProvider } from '@mui/material'
import { theme } from '@/components/lib/theme'

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
})

// Wrapper component to provide query client
export const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider theme={theme}>
    <NextIntlClientProvider locale="en" messages={messages}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </NextIntlClientProvider>
  </ThemeProvider>
)
export default queryClient
