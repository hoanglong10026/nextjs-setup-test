import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('https://jsonplaceholder.typicode.com/posts', () => {
    return HttpResponse.json([
      { id: 1, title: 'Post 1', body: 'Body of Post 1' },
      { id: 2, title: 'Post 2', body: 'Body of Post 2' },
    ]);
  }),
];
