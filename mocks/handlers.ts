import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('https://jsonplaceholder.typicode.com/posts', () => {
    return HttpResponse.json([
      { id: 1, title: 'Post 1', body: 'Body of Post 1' },
      { id: 2, title: 'Post 2', body: 'Body of Post 2' },
    ]);
  }),
  http.post(
    'https://jsonplaceholder.typicode.com/posts',
    async ({ request }) => {
      const body = (await request.json()) as Record<string, unknown>;
      return HttpResponse.json({
        data: { id: 1, ...body },
        message: 'success',
      });
    }
  ),
  http.get('https://jsonplaceholder.typicode.com/posts/:id', () => {
    return HttpResponse.json({
      id: 1,
      title: 'Test Post',
      body: 'Test Body',
    });
  }),
  http.put(
    'https://jsonplaceholder.typicode.com/posts/:id',
    async ({ request }) => {
      const body = (await request.json()) as Record<string, unknown>;
      return HttpResponse.json({
        data: { id: 1, ...body },
        message: 'success',
      });
    }
  ),
];
