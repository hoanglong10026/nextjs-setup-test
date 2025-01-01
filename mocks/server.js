import { setupServer } from 'msw/node';
import { handlers } from './handlers';

// Set up mock server with msw (Mock Service Worker)
export const server = setupServer(...handlers);

beforeAll(() => server.listen());
afterAll(() => server.close());
afterEach(() => {
  server.resetHandlers();
});
