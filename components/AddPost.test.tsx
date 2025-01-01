import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClientProvider } from '@tanstack/react-query';
import { http, HttpResponse } from 'msw';
import AddPost from './AddPost';
import queryClient from '@/mocks/react-query';
import { server } from '@/mocks/server';

// Wrapper component to provide query client
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('AddPost Component', () => {
  afterEach(() => {
    queryClient.clear();
  });

  it('renders the form correctly', () => {
    render(<AddPost />, { wrapper });

    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/body/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });

  it('successfully submits the form', async () => {
    render(<AddPost />, { wrapper });

    // Fill in the form
    fireEvent.change(screen.getByLabelText(/title/i), {
      target: { value: 'Test Title' },
    });
    fireEvent.change(screen.getByLabelText(/body/i), {
      target: { value: 'Test Body' },
    });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    // Check if loading state is shown
    expect(screen.getByText(/submitting/i)).toBeInTheDocument();

    // Wait for success message
    await waitFor(() => {
      expect(
        screen.getByText(/post created successfully/i)
      ).toBeInTheDocument();
    });

    // Check if form is cleared
    expect(screen.getByLabelText(/title/i)).toHaveValue('');
    expect(screen.getByLabelText(/body/i)).toHaveValue('');
  });

  it('displays specific error message when Error instance is received', async () => {
    // Override the default handler to return a specific error
    server.use(
      http.post('https://jsonplaceholder.typicode.com/posts', () => {
        return new HttpResponse(null, {
          status: 500,
          statusText: 'Internal Server Error',
        });
      })
    );

    render(<AddPost />, { wrapper });

    // Fill and submit form
    fireEvent.change(screen.getByLabelText(/title/i), {
      target: { value: 'Test Title' },
    });
    fireEvent.change(screen.getByLabelText(/body/i), {
      target: { value: 'Test Body' },
    });
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    // Wait for and check the specific error message
    await waitFor(() => {
      expect(
        screen.getByText(/Error: Request failed with status code 500/i)
      ).toBeInTheDocument();
    });
  });

  it('displays "Unknown error" when error is not an Error instance', async () => {
    // Mock the mutation to simulate a non-Error object
    server.use(
      http.post('https://jsonplaceholder.typicode.com/posts', () => {
        return new HttpResponse(null, {
          status: 400,
          statusText: 'Bad Request',
        });
      })
    );

    render(<AddPost />, { wrapper });

    // Fill and submit form
    fireEvent.change(screen.getByLabelText(/title/i), {
      target: { value: 'Test Title' },
    });
    fireEvent.change(screen.getByLabelText(/body/i), {
      target: { value: 'Test Body' },
    });
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    // Wait for and check the "Unknown error" message
    await waitFor(() => {
      expect(
        screen.getByText(/Error: Request failed with status code 400/i)
      ).toBeInTheDocument();
    });
  });

  it('disables submit button while submitting', async () => {
    render(<AddPost />, { wrapper });

    // Fill in the form
    fireEvent.change(screen.getByLabelText(/title/i), {
      target: { value: 'Test Title' },
    });
    fireEvent.change(screen.getByLabelText(/body/i), {
      target: { value: 'Test Body' },
    });

    const submitButton = screen.getByRole('button', { name: /submit/i });

    // Submit the form
    fireEvent.click(submitButton);

    // Check if button is disabled during submission
    expect(submitButton).toBeDisabled();

    // Wait for submission to complete
    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });
  });
});
