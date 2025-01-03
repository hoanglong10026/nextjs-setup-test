import { render, screen, waitFor } from '@testing-library/react'
import Posts from './Posts'
import { http, HttpResponse } from 'msw'
import { server } from '@/mocks/server'
import queryClient, { wrapper } from '@/mocks/react-query'

describe('Posts Component', () => {
  // Set up and start the mock server before all tests, and stop it after all tests
  afterEach(() => {
    queryClient.clear()
  })

  it('shows loading state initially', () => {
    render(<Posts />, { wrapper })
    expect(screen.getByRole('loading-state')).toBeInTheDocument()
  })

  it('should render posts when data is fetched', async () => {
    render(<Posts />, { wrapper })

    // Wait for the posts to be rendered
    await waitFor(() => screen.getByText('Post 1'))

    // Check if the posts are rendered correctly
    expect(screen.getByText('Post 1')).toBeInTheDocument()
    expect(screen.getByText('Body of Post 1')).toBeInTheDocument()
    expect(screen.getByText('Post 2')).toBeInTheDocument()
    expect(screen.getByText('Body of Post 2')).toBeInTheDocument()
  })

  it('should display error message when the fetch fails', async () => {
    // Mock a server error for the fetch request
    server.use(
      http.get('https://jsonplaceholder.typicode.com/posts', () => {
        return HttpResponse.json(null, {
          status: 500,
          statusText: 'Internal Server Error',
        })
      })
    )

    render(<Posts />, { wrapper })
    await waitFor(() => screen.getByText(/Error loading posts/))

    expect(screen.getByText(/Error loading posts/)).toBeInTheDocument()
  })
})
