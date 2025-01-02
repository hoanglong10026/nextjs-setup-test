import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRouter } from 'next/navigation';
import EditPost from './EditPost';

import { wrapper } from '@/mocks/react-query';
import { server } from '@/mocks/server';
import { http, HttpResponse } from 'msw';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Setup router mock
const mockPush = jest.fn();
const mockRouter = {
  push: mockPush,
};
const mockUseRouter = useRouter as jest.Mock;

describe('EditPost', () => {
  beforeEach(() => {
    mockUseRouter.mockReturnValue(mockRouter);
  });

  it('renders loading state initially', () => {
    render(<EditPost id="1" />, { wrapper });
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('loads and displays post data', async () => {
    render(<EditPost id="1" />, { wrapper });

    await waitFor(() => {
      expect(screen.getByLabelText('Title:')).toHaveValue('Test Post');
      expect(screen.getByLabelText('Body:')).toHaveValue('Test Body');
    });
  });

  it('handles form submission successfully', async () => {

    const user = userEvent.setup();

    render(<EditPost id="1" />, { wrapper });

    // Wait for the form to load with initial data
    await waitFor(() => {
      expect(screen.getByLabelText('Title:')).toBeInTheDocument();
    });

    // Update form fields
    const titleInput = screen.getByLabelText('Title:');
    const bodyInput = screen.getByLabelText('Body:');

    await user.clear(titleInput);
    await user.type(titleInput, 'Updated Title');
    
    await user.clear(bodyInput);
    await user.type(bodyInput, 'Updated Body');

    // Submit form
    const submitButton = screen.getByRole('submit-button');
    await user.click(submitButton);
    
    // Verify loading state
    expect(submitButton).toBeDisabled();
    expect(submitButton).toHaveTextContent('Updating...');

    // Verify navigation occurred
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/');
    });
  });

  it('handles fetch error', async () => {
    server.use(
      http.get('https://jsonplaceholder.typicode.com/posts/:id', () => {
        return HttpResponse.json(null, { status: 500 });
      })
    );

    render(<EditPost id="1" />, { wrapper });

    await waitFor(() => {
      expect(screen.getByText('Error loading post')).toBeInTheDocument();
    });
  });

  it('handles update error', async () => {

    const user = userEvent.setup();

    server.use(
      http.put('https://jsonplaceholder.typicode.com/posts/:id', () => {
        return HttpResponse.json(null, { status: 500 });
      })
    );

    render(<EditPost id="1" />, { wrapper });

    // Wait for the form to load
    await waitFor(() => {
      expect(screen.getByLabelText('Title:')).toBeInTheDocument();
    });

    // Submit form
    const submitButton = screen.getByText('Update Post');
    user.click(submitButton);

    // Verify error message
    await waitFor(() => {
      expect(screen.getByText(/Error:/)).toBeInTheDocument();
    });
  });

  it('navigates back on cancel', async () => {

    const user = userEvent.setup();

    render(<EditPost id="1" />, { wrapper });

    // Wait for the form to load
    await waitFor(() => {
      expect(screen.getByLabelText('Title:')).toBeInTheDocument();
    });

    // Click cancel button
    const cancelButton = screen.getByText('Cancel');
    await user.click(cancelButton);

    expect(mockPush).toHaveBeenCalledWith('/');
  });
});
